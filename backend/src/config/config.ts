
export const config = {
    port: process.env.PORT || 5000,
    mongoUrl: process.env.MONGO_DB_URL || '',
    jwtSecret: process.env.JWT_SECRET || '',
    baseUrl: process.env.BASE_URL || '',
};

if (!config.mongoUrl || !config.jwtSecret) {
    throw new Error('Required environment variables are missing');
}