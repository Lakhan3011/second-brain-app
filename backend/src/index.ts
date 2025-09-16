import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, LinkModel, UserModel } from './db';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from './config/config';
import { userMiddleware } from './middleware';
import { AuthRequest } from './types';
import cors from "cors";
import { generateShortHash } from './hash';
import { signinSchema, signupSchema } from './validators/auth.schema';


const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(config.mongoUrl).then(() => console.log('connected to mongoDB'));

app.post('/api/v1/signup', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = signupSchema.safeParse({ username, password });
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues[0].message,
        })
    }

    try {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists with this username'
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.create({
            username,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.post('/api/v1/signin', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = signinSchema.safeParse({ username, password });
    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: result.error.issues[0].message,
        })
    }

    try {
        const User = await UserModel.findOne({ username });
        if (!User) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        const passwordMatch = await bcrypt.compare(password, User.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid username or password",
            });
        }
        const token = jwt.sign({ username: User.username, id: User._id }, config.jwtSecret, {
            expiresIn: '1h'
        });

        return res.status(200).json({
            success: true,
            token: token,
            message: 'User signed in successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
})

app.post('/api/v1/content', userMiddleware, async (req: AuthRequest, res: Response) => {
    const { title, link, type } = req.body;
    await ContentModel.create({
        title,
        link,
        type,
        userId: req.user?.id
    })

    return res.status(200).json({
        message: "Content added"
    })
})

app.get('/api/v1/content', userMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                message: "Unauthorized access"
            })
        }
        const content = await ContentModel.find({
            userId: req.user.id
        }).populate('userId', 'username')
            .lean();

        return res.status(200).json({
            content
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

app.delete('/api/v1/content', userMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const { contentId } = req.body;
        if (!contentId) {
            return res.status(400).json({
                message: 'Content ID is required'
            });
        }

        const deleted = await ContentModel.findOneAndDelete({
            _id: contentId,
            userId: req.user.id
        })
        if (!deleted) {
            return res.status(404).json({
                message: 'Content not found or you do not have access to delete it'
            })
        }

        return res.status(200).json({
            message: 'Deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }

})

app.post('/api/v1/brain/share', userMiddleware, async (req: AuthRequest, res: Response) => {
    try {

        const share = req.body.share;
        const userId = req.user?.id;

        if (share) {
            const existingLink = await LinkModel.findOne({
                userId,
                expiresAt: { $gt: new Date() }
            });

            if (existingLink) {
                return res.status(200).json({
                    success: true,
                    shareableUrl: existingLink.hash,
                    alreadyExisted: true,
                    expiresAt: existingLink.expiresAt
                })
            }

            const hash = generateShortHash(8);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // after 7 days
            const link = await LinkModel.create({
                hash,
                userId,
                createdAt: new Date(),
                expiresAt
            });

            return res.status(201).json({
                success: true,
                shareableUrl: link.hash,
                expiresAt: expiresAt
            })
        } else {
            await LinkModel.deleteOne({
                userId
            })

            return res.status(200).json({
                success: true,
                message: "Share link revoked"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
})

app.get('/api/v1/brain/share/:shareLink', async (req: Request, res: Response) => {
    try {
        const { shareLink } = req.params;
        const link = await LinkModel.findOne({ hash: shareLink })

        if (!link) {
            return res.status(404).json({
                success: false,
                error: "Link not found"
            })
        }

        if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
            return res.status(410).json({
                success: false,
                error: 'This Link has expired'
            })
        }

        const content = await ContentModel.find({
            userId: link.userId
        })

        const user = await UserModel.findOne({
            _id: link.userId
        })

        if (!user) {
            return res.status(411).json({
                success: false,
                message: "User not found, error should ideally not happen"
            })
        }

        return res.status(200).json({
            success: true,
            content: content,
            username: user.username
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
})

app.listen(config.port, () => {
    console.log(`Server is listening on PORT ${config.port}`)
})