const { Router } = require("express");
const Joi = require('joi');
const routerPerfil = Router();
const Perfil = require("../models/perfilModel");
const Conta = require("../models/contaModel");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

routerPerfil.use(bodyParser.json());
//validação
const perfilSchema = Joi.object({
    data_nasc: Joi.date().iso().allow(null).optional(),
    sexo: Joi.string().valid('M', 'F').allow(null).optional(),
    tipo_sang: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').allow(null).optional(),
    doenca_pre: Joi.string().max(150).allow(null).optional(),
    remedio: Joi.string().max(100).allow(null).optional(),
    descricao: Joi.string().allow(null).optional()
});

routerPerfil.get('/dados/perfil/:idConta', async (req, res) => {
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

            const perfil = await Perfil.findOne({ where: { id_Conta: idConta }, include: [{ model: Conta, attributes: ['nome', 'email'] }] });

            if (!perfil) {
                return res.status(404).json({ error: 'Perfil não encontrado.' });
            }

            return res.status(200).json(perfil);
        });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerPerfil.post('/adicionar/perfil', async (req, res) => {
    const { id_Conta, data_nasc, sexo, tipo_sang, doenca_pre, remedio, descricao } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = perfilSchema.validate({ data_nasc, sexo, tipo_sang, doenca_pre, remedio, descricao });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const perfil = await Perfil.create({
                id_Conta,
                data_nasc,
                sexo,
                tipo_sang,
                doenca_pre,
                remedio,
                descricao
            });

            return res.status(201).json(perfil);
        });
    } catch (error) {
        console.error('Erro ao criar perfil:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerPerfil.put('/atualizar/perfil/:id_Conta', async (req, res) => {
    const { id_Conta } = req.params;
    const { data_nasc, sexo, tipo_sang, doenca_pre, remedio, descricao } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = perfilSchema.validate({ data_nasc, sexo, tipo_sang, doenca_pre, remedio, descricao });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const perfilExistente = await Perfil.findOne({ where: { id_Conta } });
            if (!perfilExistente) {
                return res.status(404).json({ error: 'Perfil não encontrado.' });
            }

            await Perfil.update({
                data_nasc,
                sexo,
                tipo_sang,
                doenca_pre,
                remedio,
                descricao
            }, {
                where: { id_Conta }
            });

            const perfilAtualizado = await Perfil.findOne({ where: { id_Conta } });
            return res.status(200).json(perfilAtualizado);
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerPerfil.delete('/deletar/perfil/:id', async (req, res) => {
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

            const perfilExistente = await Perfil.findByPk(id);
            if (!perfilExistente) {
                return res.status(404).json({ error: 'Perfil não encontrado.' });
            }

            await Perfil.destroy({
                where: { idPerfil: id }
            });

            return res.status(200).json({ message: 'Perfil excluído com sucesso.' });
        });
    } catch (error) {
        console.error('Erro ao excluir perfil:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = routerPerfil;