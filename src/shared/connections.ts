import { createClient } from 'redis';
export const redisClient = createClient();
import { PrismaClient } from "@prisma/client";
import * as nodemailer from "nodemailer"

export async function redisConnect() {
    redisClient.on('error', err => console.log('Redis Client Error', err));
    await redisClient.connect();
}

export const prisma = new PrismaClient()

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER_HOST,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: { rejectUnauthorized: false }
});