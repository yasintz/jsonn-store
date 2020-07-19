require('dotenv').config();

const config = {
  REDISCLOUD_URL: process.env.REDISCLOUD_URL as string,
};

export default config;
