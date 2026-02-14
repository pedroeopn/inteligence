import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.post("/teste", (req, res) => res.send("POST funcionando!"));
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

app.get("/", (req, res) => {
    res.send("Inteligence API funcionando");
});

app.listen(3000, () => {
    console.log('Servidor rodando em localhost:${PORT}');
});