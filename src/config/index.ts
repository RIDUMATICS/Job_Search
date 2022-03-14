import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  mail: {
    user: process.env.user,
    pass: process.env.pass,
    receiver: process.env.receiver,
  },
};
