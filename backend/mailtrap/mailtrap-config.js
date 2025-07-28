import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const Endpoint = process.env.MAILTRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
  endpoint: Endpoint,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Notes App",
};


