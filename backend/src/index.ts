import dotenv from 'dotenv'
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import routes from './routes/main.routes.js';
import { PrismaClient } from './generated/prisma/index.js';
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';


const app = new Hono();
export const db = new PrismaClient();

dotenv.config()

app.use(logger());

app.use(
	cors({
		origin: ['http://localhost:5173'],
    credentials: true,
	})
);

app.route('/', routes);

app.get('/', (c) => {
	return c.text('Test!');
});

process.on('beforeExit', async () => {
  await db.$disconnect()
})

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
