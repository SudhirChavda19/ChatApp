// redisClient.js
const {createClient} = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // local or managed Redis URL
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to Redis"));

redisClient.connect();

module.exports = {redisClient};
