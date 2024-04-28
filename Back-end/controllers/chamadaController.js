const { Router } = require("express");
const Joi = require('joi');
const routerChamada = Router();
const Chamada = require("../models/chamadaModel");
const bodyParser = require("body-parser");


routerChamada.use(bodyParser.json());
// validação Joi
const chamadaSchema = Joi.object({
    nome: Joi.string().max(80).required(),
    telefone: Joi.string().max(15).required(),
    imagem: Joi.binary().allow(null).optional()
});

// GET - Obter todas as chamadas
routerChamada.get('/chamada', async (req, res) => {
    try {
        const chamadas = await Chamada.findAll();
        return res.status(200).json(chamadas);
    } catch (error) {
        console.error('Erro ao buscar chamadas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// POST - Adicionar uma nova chamada
routerChamada.post('/realizar/chamada', async (req, res) => {
    const { nome, telefone, imagem } = req.body;

    try {
        const { error } = chamadaSchema.validate({ nome, telefone, imagem });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const novaChamada = await Chamada.create({ nome, telefone, imagem });

        return res.status(201).json(novaChamada);
    } catch (error) {
        console.error('Erro ao adicionar chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// PUT - Atualizar uma chamada existente
routerChamada.put('/atualizar/chamada/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, imagem } = req.body;

    try {
        const { error } = chamadaSchema.validate({ nome, telefone, imagem });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const chamadaExistente = await Chamada.findByPk(id);
        if (!chamadaExistente) {
            return res.status(404).json({ error: 'Chamada não encontrada.' });
        }

        await Chamada.update({ nome, telefone, imagem }, { where: { idChamada: id } });

        const chamadaAtualizada = await Chamada.findByPk(id);
        return res.status(200).json(chamadaAtualizada);
    } catch (error) {
        console.error('Erro ao atualizar chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// DELETE - Excluir uma chamada
routerChamada.delete('/deletar/chamada/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const chamadaExistente = await Chamada.findByPk(id);
        if (!chamadaExistente) {
            return res.status(404).json({ error: 'Chamada não encontrada.' });
        }

        await Chamada.destroy({ where: { idChamada: id } });

        return res.status(200).json({ message: 'Chamada excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir chamada:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = routerChamada;