import { createClient } from 'redis';
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('Redis Client Error', err));
if (process.env.NODE_ENV !== 'test') {
    (async () => {
        try {
            await redisClient.connect();
            console.log("Redis connected successfully!");
        } catch (err) {
            console.error("Redis connection failed:", err);
        }
    })();
}

export default redisClient;