const { Router } = require("express");
const Joi = require('joi');
const routerEndereco = Router();
const Endereco = require("../models/enderecoModel");
const bodyParser = require("body-parser");

routerEndereco.use(bodyParser.json());

// Validação
const enderecoSchema = Joi.object({
    idPerfil: Joi.number().integer().required(),
    rua: Joi.string().max(100).required(),
    cidade: Joi.string().max(100).required(),
    estado: Joi.string().max(50).required(),
    cep: Joi.string().max(20).required()
});

routerEndereco.get('/buscar/endereco/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const endereco = await Endereco.findByPk(id);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado.' });
        }

        return res.status(200).json(endereco);
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.post('/adicionar/endereco', async (req, res) => {
    const { idPerfil, rua, cidade, estado, cep } = req.body;

    try {
        const { error } = enderecoSchema.validate({ idPerfil, rua, cidade, estado, cep });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const endereco = await Endereco.create({
            idPerfil,
            rua,
            cidade,
            estado,
            cep
        });

        return res.status(201).json(endereco);
    } catch (error) {
        console.error('Erro ao criar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.put('/atualizar/endereco/:id', async (req, res) => {
    const { id } = req.params;
    const { rua, cidade, estado, cep } = req.body;

    try {
        const { error } = enderecoSchema.validate({ rua, cidade, estado, cep });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const enderecoExistente = await Endereco.findByPk(id);
        if (!enderecoExistente) {
            return res.status(404).json({ error: 'Endereço não encontrado.' });
        }

        await enderecoExistente.update({
            rua,
            cidade,
            estado,
            cep
        });

        const enderecoAtualizado = await Endereco.findByPk(id);
        return res.status(200).json(enderecoAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

routerEndereco.delete('/deletar/endereco/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const enderecoExistente = await Endereco.findByPk(id);
        if (!enderecoExistente) {
            return res.status(404).json({ error: 'Endereço não encontrado.' });
        }

        await enderecoExistente.destroy();

        return res.status(200).json({ message: 'Endereço excluído com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = routerEndereco;