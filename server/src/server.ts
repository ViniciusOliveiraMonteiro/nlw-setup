import Fastify from "fastify";
import 'dotenv';
import cors from '@fastify/cors';
import { habitRoutes } from "./routes/habit";
import { dayRoutes } from "./routes/day";


const app = Fastify();

app.register(cors);
app.register(habitRoutes);
app.register(dayRoutes);

app.listen({
  port: 3333,
  host: '0.0.0.0',
}).then(() => {
  console.log('HTTP Server listening');
});
