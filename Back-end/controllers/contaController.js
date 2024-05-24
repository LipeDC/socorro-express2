const { Router } = require('express');
const routerConta = Router();
const Conta = require('../models/contaModel');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bodyParser = require("body-parser");
require('dotenv').config();

const blacklist = new Set();
const SECRET = process.env.JWT_SECRET;

routerConta.use(bodyParser.json());

// validação (Joi)
const contaSchema = Joi.object({
    nome: Joi.string().pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ ]+$/).min(2).max(80).required().messages({
        'string.pattern.base': 'Nome inválido, ele só pode conter letras',
        'any.required': 'O nome é obrigatório'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'E-mail inválido',
        'any.required': 'O e-mail é obrigatório'
    }),
    senha: Joi.string().min(8).required().messages({
        'string.min': 'A senha deve ter no mínimo 8 caracteres',
        'any.required': 'A senha é obrigatória'
    }),
    confirmarSenha: Joi.string().valid(Joi.ref('senha')).required().label('Confirmação de Senha').messages({
        'any.only': 'As senhas devem coincidir',
        'any.required': 'A confirmação de senha é obrigatória'
    }),
});

const senhaSchema = Joi.object({
    senha: Joi.string().min(8).required().messages({
        'string.min': 'A senha deve ter no mínimo 8 caracteres',
        'any.required': 'A senha é obrigatória'
    }),
    confirmarSenha: Joi.string().valid(Joi.ref('senha')).required().label('Confirmação de Senha').messages({
        'any.only': 'As senhas devem coincidir',
        'any.required': 'A confirmação de senha é obrigatória'
    }),
});

const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'E-mail inválido',
        'any.required': 'O e-mail é obrigatório'
    }),
    confirmarEmail: Joi.string().email().valid(Joi.ref('email')).required().label('Confirmação de Email').messages({
        'any.only': 'As senhas devem coincidir',
        'any.required': 'A confirmação de senha é obrigatória'
    }),
});


// GET - Buscar uma conta
routerConta.get('/buscar/conta/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const conta = await Conta.findByPk(id);

            if (!conta) {
                return res.status(404).json({ error: 'Conta não encontrada.' });
            }

            return res.status(200).json(conta);
        });
    } catch (error) {
        console.error('Erro ao buscar conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// POST - Adicionar uma nova conta
routerConta.post('/cadastrar/conta', async (req, res) => {
    const { nome, email, senha, confirmarSenha } = req.body;

    try {
        const { error } = contaSchema.validate({ nome, email, senha, confirmarSenha }, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({ errors });
        }

        const contaExistente = await Conta.findOne({ where: { email } });
        if (contaExistente) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const novaConta = await Conta.create({ nome, email, senha: hashedPassword });

        return res.status(201).json(novaConta);
    } catch (error) {
        console.error('Erro ao adicionar conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerConta.put('/atualizar/conta/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, confirmarSenha } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = contaSchema.validate({ nome, email, senha, confirmarSenha }, { abortEarly: false });
            if (error) {
                const errors = error.details.map(detail => detail.message);
                return res.status(400).json({ errors });
            }

            const contaExistente = await Conta.findByPk(id);
            if (!contaExistente) {
                return res.status(404).json({ error: 'Conta não encontrada.' });
            }

            let hashedPassword = contaExistente.senha;
            if (senha) {
                hashedPassword = await bcrypt.hash(senha, 10);
            }

            await Conta.update({ nome, email, senha: hashedPassword }, { where: { idConta: id } });

            const contaAtualizada = await Conta.findByPk(id);
            return res.status(200).json(contaAtualizada);
        });
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerConta.put('/atualizar/senha/:id', async (req, res) => {
    const { id } = req.params;
    const { senha, confirmarSenha } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = senhaSchema.validate({ senha, confirmarSenha }, { abortEarly: false });
            if (error) {
                const errors = error.details.map(detail => detail.message);
                return res.status(400).json({ errors });
            }

            const contaExistente = await Conta.findByPk(id);
            if (!contaExistente) {
                return res.status(404).json({ error: 'Conta não encontrada.' });
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Atualizar senha no banco de dados
            await Conta.update({ senha: hashedPassword }, { where: { idConta: id } });

            const contaAtualizada = await Conta.findByPk(id);
            return res.status(200).json(contaAtualizada);
        });
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerConta.put('/atualizar/email/:id', async (req, res) => {
    const { id } = req.params;
    const { email, confirmarEmail } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = emailSchema.validate({ email, confirmarEmail }, { abortEarly: false });
            if (error) {
                const errors = error.details.map(detail => detail.message);
                return res.status(400).json({ errors });
            }

            const contaExistente = await Conta.findByPk(id);
            if (!contaExistente) {
                return res.status(404).json({ error: 'Conta não encontrada.' });
            }

            await Conta.update({ email }, { where: { idConta: id } });

            const contaAtualizada = await Conta.findByPk(id);
            return res.status(200).json(contaAtualizada);
        });
    } catch (error) {
        console.error('Erro ao atualizar conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerConta.delete('/deletar/conta/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
    }

    try {
        // Verifica e valida o token
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const contaExistente = await Conta.findByPk(id);
            if (!contaExistente) {
                return res.status(404).json({ error: 'Conta não encontrada.' });
            }

            await Conta.destroy({ where: { idConta: id } });

            // Adiciona o token à blacklist
            blacklist.add(token);

            return res.status(200).json({ message: 'Conta excluída com sucesso.' });
        });
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// POST - Login
routerConta.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const conta = await Conta.findOne({ where: { email } });
        if (!conta) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, conta.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gerar token com ID
        const token = generateAuthToken(conta.id);

        console.log("ID do usuário:", conta.id);
        console.log("Token gerado:", token);

        return res.status(200).json({ token, userId: conta.idConta }); // ID/token
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// POST - Logout
routerConta.post('/logout', (req, res) => {
    const tokenHeader = req.headers["authorization"];
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (token) {
        //lista negra
        blacklist.add(token);

        res.status(200).json({ message: 'Logout realizado com sucesso' });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

// Função (JWT)
function generateAuthToken(userId) {
    const token = jwt.sign({ userId }, SECRET, { expiresIn: '10d' }); // chave secreta - tempo de expiração
    return token;
}

module.exports = routerConta;