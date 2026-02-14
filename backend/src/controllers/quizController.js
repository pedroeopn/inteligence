import db from '../db/config.js';

const questions = [
    { id: 1, text: "Você gosta de resolver quebra-cabeças lógicos?", category: "lógica" },
    { id: 2, text: "Você tem facilidade em aprender novos idiomas?", category: "linguística" },
    { id: 3, text: "Você consegue visualizar objetos em 3D facilmente?", category: "espacial" },
    { id: 4, text: "Você gosta de fazer cálculos mentais?", category: "matemática" },
]

export const getQuestions = (req, res) => {
    res.json(questions);
}

export const submitAnswers = async (req, res) => {
    const { answers } = req.body;
    const userId = req.userId;

    const dominantType = Object.keys(answers).reduce((a, b) => answers[a] > answers[b] ? a : b);

    try {
        await db('results').insert({
            user_id: userId,
            dominant_type: dominantType,
            scores: JSON.stringify(answers)
        });
    
        res.json({
            message: "Resultado salvo!",
            dominantType,
            allScores: answers
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao salvar resultado" });
    }
};