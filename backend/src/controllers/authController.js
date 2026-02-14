import db from '../db/config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db('users').insert({ username, password: hashedPassword});
        res.status(201).json({ message: "Usuário criado com sucesso" });
    } catch {
        res.status(400).json({ error: "Erro ao registrar usuário. Talvezs o nome já exista?"});
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await db('users').where({ username }).first();

    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, 'SUA_CHAVE_SECRETA', { expiresIn: '1d' });
        return res.json({ token, username: user.username});
    }

    res.status(401).json({ error: "Credenciais inválidas" });
};