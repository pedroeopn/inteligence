import express from 'express';
import { getQuestions, submitAnswers } from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', getQuestions);

router.post('/submit', authMiddleware, submitAnswers);

export default router;