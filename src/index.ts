import { Elysia } from "elysia";
import { folderModule } from "./modules/folder";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400, // 24 jam cache preflight
  }))
  .use(folderModule)
  .get("/", () => "Hello Elysia")
  .listen(3008);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
