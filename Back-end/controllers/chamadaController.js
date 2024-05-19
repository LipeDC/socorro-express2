const { Router } = require("express");
const Joi = require('joi');
const routerChamada = Router();
const Chamada = require("../models/chamadaModel");
const Perfil = require('../models/perfilModel');
const Endereco = require('../models/enderecoModel');
const Conta = require('../models/contaModel')
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;


routerChamada.use(bodyParser.json());
// validação Joi
const chamadaSchema = Joi.object({
    id_Perfil: Joi.number().integer().required(),
    id_Endereco: Joi.number().integer().required(),
    cod_ambu: Joi.string().max(100)
});

// GET - Obter todas as chamadas
routerChamada.get('/chamada', async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const chamadas = await Chamada.findAll();
            return res.status(200).json(chamadas);
        });
    } catch (error) {
        console.error('Erro ao buscar chamadas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerChamada.post('/realizar/chamada', async (req, res) => {
    const { id_Perfil, id_Endereco, cod_ambu } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = chamadaSchema.validate({ id_Perfil, id_Endereco, cod_ambu });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const novaChamada = await Chamada.create({ 
                id_Perfil, 
                id_Endereco, 
                cod_ambu 
            });

            return res.status(201).json(novaChamada);
        });
    } catch (error) {
        console.error('Erro ao adicionar chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerChamada.put('/atualizar/chamada/:id', async (req, res) => {
    const { id } = req.params;
    const { id_Perfil, id_Endereco, cod_ambu } = req.body;
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const { error } = chamadaSchema.validate({ id_Perfil, id_Endereco, cod_ambu });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const chamadaExistente = await Chamada.findByPk(id);
            if (!chamadaExistente) {
                return res.status(404).json({ error: 'Chamada não encontrada.' });
            }

            await Chamada.update({ 
                id_Perfil, 
                id_Endereco, 
                cod_ambu 
            }, { where: { idChamada: id } });

            const chamadaAtualizada = await Chamada.findByPk(id);
            return res.status(200).json(chamadaAtualizada);
        });
    } catch (error) {
        console.error('Erro ao atualizar chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerChamada.delete('/deletar/chamada/:id', async (req, res) => {
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

            const chamadaExistente = await Chamada.findByPk(id);
            if (!chamadaExistente) {
                return res.status(404).json({ error: 'Chamada não encontrada.' });
            }

            await Chamada.destroy({ where: { idChamada: id } });

            return res.status(200).json({ message: 'Chamada excluída com sucesso.' });
        });
    } catch (error) {
        console.error('Erro ao excluir chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerChamada.get('/chamadas/completas', async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    try {
        if (!token) {
            return res.status(401).json({ error: 'Token JWT ausente. Acesso não autorizado.' });
        }

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token JWT inválido. Acesso não autorizado.' });
            }

            const chamadas = await Chamada.findAll({
                include: [
                    {
                        model: Endereco,
                        attributes: ['endereco'],
                        include: [
                            {
                                model: Perfil,
                                attributes: ['data_nasc', 'sexo', 'tipo_sang', 'doenca_pre', 'remedio', 'descricao'],
                                include: [
                                    {
                                        model: Conta,
                                        attributes: ['nome']
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            res.json(chamadas);
        });
    } catch (error) {
        console.error('Erro ao buscar chamadas:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = routerChamada;