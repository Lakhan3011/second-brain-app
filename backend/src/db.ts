import { Document, Schema, model, Types } from "mongoose";
import { required } from "zod/v4/core/util.cjs";

interface IUser extends Document {
    username: string;
    password: string;
}

interface ITag extends Document {
    title: string;
}

type ContentType = 'image' | 'video' | 'article' | 'audio';

interface IContent extends Document {
    title: string;
    link: string;
    type: ContentType;
    tags: ITag[];
    userId: IUser;
}

interface ILink extends Document {
    hash: string;
    userId: IUser;
    createdAt: Date;
    expiresAt: Date;
}

const userSchema = new Schema<IUser>({
    username: { type: String, unique: true, required: true, minlength: 3, maxlength: 20 },
    password: { type: String, required: true }
})

const contentTypes = ['tweet', 'youtube', 'article', 'image'] as const;

const contentSchema = new Schema<IContent>({
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    tags: [{ type: Types.ObjectId, ref: 'Tag' }],
    userId: { type: Types.ObjectId, ref: 'User', required: true }
})

const tagSchema = new Schema<ITag>({
    title: { type: String, required: true }
});

const linkSchema = new Schema<ILink>({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});

linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserModel = model<IUser>('User', userSchema)
const TagModel = model<ITag>('Tag', tagSchema)
const ContentModel = model<IContent>('Content', contentSchema);
const LinkModel = model<ILink>('Link', linkSchema);

export { UserModel, TagModel, ContentModel, LinkModel }
