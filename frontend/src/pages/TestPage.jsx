import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, LogOut } from 'lucide-react';
import './TestPage.css';

const TestPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchQuestions();
    }, [navigate]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/quiz/questions');
            if (!response.ok) throw new Error('Falha ao buscar perguntas');

            const data = await response.json();
            setQuestions(data);
            // Initialize answers with default value 3 (Neutral)
            const initialAnswers = {};
            data.forEach(q => {
                initialAnswers[q.id] = 3;
            });
            setAnswers(initialAnswers);
        } catch (error) {
            console.error('Failed to fetch questions', error);
            alert('Erro ao carregar perguntas.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const calculateResults = () => {
        const scores = {};

        questions.forEach(q => {
            const category = q.category;
            const score = answers[q.id] || 0;

            if (!scores[category]) {
                scores[category] = 0;
            }
            scores[category] += score;
        });

        return scores;
    };

    const handleSubmit = async () => {
        const calculatedScores = calculateResults();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:3000/api/quiz/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers: calculatedScores })
            });

            if (!response.ok) throw new Error('Falha ao enviar respostas');

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Submission failed', error);
            alert('Erro ao enviar respostas.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    if (loading) return <div className="test-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

    return (
        <div className="test-container">
            <div className="test-wrapper">

                <div className="test-header">
                    <h1 className="page-title">Teste de Inteligência</h1>
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        <span>Sair</span>
                        <LogOut size={20} />
                    </button>
                </div>

                {result ? (
                    <div className="results-card">
                        <div className="success-icon-wrapper">
                            <Check size={48} className="success-icon" />
                        </div>
                        <h2 className="result-title">Resultado</h2>
                        <p className="result-description">
                            Sua inteligência dominante é:
                        </p>
                        <div className="dominant-type">
                            {result.dominantType}
                        </div>

                        <div className="breakdown-grid">
                            <div className="breakdown-title">Detalhamento</div>
                            {Object.entries(result.allScores).map(([type, score]) => (
                                <div key={type} className="score-row">
                                    <span className="score-label">{type}</span>
                                    <span className="score-value">{score} pts</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => { setResult(null); fetchQuestions(); }}
                            className="retry-button"
                        >
                            Refazer Teste
                        </button>
                    </div>
                ) : (
                    <div className="questions-list">
                        {questions.map((q) => (
                            <div key={q.id} className="question-card">
                                <h3 className="question-text">{q.text}</h3>

                                <div className="scale-container">
                                    <span className="scale-label">Discordo</span>
                                    <div className="scale-options">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <label key={val} className="scale-option">
                                                <input
                                                    type="radio"
                                                    name={`q-${q.id}`}
                                                    value={val}
                                                    checked={answers[q.id] === val}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    className="scale-input"
                                                />
                                                <div className="scale-circle">
                                                    {val}
                                                </div>
                                                <span className="scale-tooltip">
                                                    {val === 1 ? 'Discordo totalmente' : val === 5 ? 'Concordo totalmente' : ''}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <span className="scale-label">Concordo</span>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleSubmit}
                            className="submit-quiz-button"
                        >
                            Finalizar e Ver Resultado
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestPage;
