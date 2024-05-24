const { Router } = require("express");
const Joi = require('joi');
const routerEndereco = Router();
const Endereco = require("../models/enderecoModel");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

routerEndereco.use(bodyParser.json());

// Validação
const enderecoSchema = Joi.object({
    id_Conta: Joi.number().integer().required(),
    nome_end: Joi.string().max(80).required(),
    endereco: Joi.string().max(255).required(),
});

const at_endSchema = Joi.object({
    nome_end: Joi.string().max(80).required(),
    endereco: Joi.string().max(255).required(),
});

routerEndereco.get('/buscar/endereco/:idConta', async (req, res) => {
    const { idConta } = req.params;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const endereco = await Endereco.findAll({ where: { id_Conta: idConta } });

            if (!endereco) {
                return res.status(404).json({ error: 'Endereço não encontrado.' });
            }

            return res.status(200).json(endereco);
        });
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.post('/adicionar/endereco', async (req, res) => {
    const { id_Conta, nome_end, endereco } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = enderecoSchema.validate({ id_Conta, nome_end, endereco });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const enderecoCriado = await Endereco.create({
                id_Conta,
                nome_end,
                endereco
            });

            return res.status(201).json(enderecoCriado);
        });
    } catch (error) {
        console.error('Erro ao criar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.put('/atualizar/endereco/:id', async (req, res) => {
    const { id } = req.params;
    const { nome_end, endereco } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = at_endSchema.validate({ nome_end, endereco });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const enderecoExistente = await Endereco.findByPk(id);
            if (!enderecoExistente) {
                return res.status(404).json({ error: 'Endereço não encontrado.' });
            }

            await enderecoExistente.update({
                nome_end,
                endereco
            });

            const enderecoAtualizado = await Endereco.findByPk(id);
            return res.status(200).json(enderecoAtualizado);
        });
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.delete('/deletar/endereco/:id', async (req, res) => {
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

            const enderecoExistente = await Endereco.findByPk(id);
            if (!enderecoExistente) {
                return res.status(404).json({ error: 'Endereço não encontrado.' });
            }

            await enderecoExistente.destroy();

            return res.status(200).json({ message: 'Endereço excluído com sucesso.' });
        });
    } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = routerEndereco;