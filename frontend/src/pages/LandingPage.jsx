import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, CheckCircle, Lock } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const url = `http://localhost:3000${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Ocorreu um erro.');
            }

            if (isLogin) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                navigate('/test');
            } else {
                setIsLogin(true);
                setError('Conta criada com sucesso! Faça login para continuar.');
            }
        } catch (err) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-container">
            <header className="landing-header">
                <div className="brand">
                    <Brain className="brand-icon" size={32} />
                    <span>Inteligence</span>
                </div>
            </header>

            <main className="landing-main">
                <div className="hero-section">
                    <h1 className="hero-title">
                        Descubra o seu <span className="highlight">Potencial</span>
                    </h1>
                    <p className="hero-description">
                        Faça nosso teste de inteligência exclusivo e entenda melhor suas habilidades cognitivas.
                        Rápido, preciso e revelador.
                    </p>
                    <div className="features">
                        <div className="feature-item">
                            <CheckCircle className="feature-icon" size={20} />
                            <span>Análise detalhada de perfil</span>
                        </div>
                        <div className="feature-item">
                            <CheckCircle className="feature-icon" size={20} />
                            <span>Resultados imediatos</span>
                        </div>
                        <div className="feature-item">
                            <CheckCircle className="feature-icon" size={20} />
                            <span>Baseado em ciência cognitiva</span>
                        </div>
                    </div>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h2 className="auth-title">
                            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                        </h2>
                        <p className="auth-subtitle">
                            {isLogin
                                ? 'Insira suas credenciais para acessar o teste.'
                                : 'Preencha os dados e comece sua jornada.'}
                        </p>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Usuário</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                placeholder="Seu nome de usuário"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Senha</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Sua senha secreta"
                                />
                                <div className="input-icon">
                                    <Lock size={20} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            <span>{loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}</span>
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <div className="auth-footer">
                        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="toggle-button"
                        >
                            {isLogin ? 'Cadastre-se' : 'Fazer login'}
                        </button>
                    </div>
                </div>
            </main>

            <footer className="landing-footer">
                &copy; {new Date().getFullYear()} Inteligence. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default LandingPage;
