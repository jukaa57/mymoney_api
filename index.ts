import express from 'express';
import { Routers } from "./src/routes";
import { redisConnect } from "./src/shared/connections";

export const app = express();
const PORT = process.env.PORT

app.listen(PORT, async() => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
})
app.use(express.json()) 

redisConnect()
Routers();

