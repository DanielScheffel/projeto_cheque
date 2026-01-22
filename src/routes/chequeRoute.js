import express from "express";
import pool from "../database/database.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { statusMiddleware } from "../middlewares/statusMiddleware.js";


const router = express.Router();

router.post("/criar", authMiddleware, statusMiddleware, async (req, res) => {

    const { numerocheque, valor, empresa, contato } = req.body;

    try {
        if(!numerocheque || !valor || !empresa || !contato) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios"
            })
        }

        const usuario = req.user.usuario;

        const [exists] = await pool.query("SELECT numeroCheque FROM cheque WHERE numeroCheque = ?", [numerocheque]);

        if(exists.length > 0){
            return res.status(409).json({
                message: "Cheque já cadastrado"
            })
        }

        await pool.query(
            `INSERT INTO cheque (numerocheque, valor, empresa, contato, gerencia_usuario) VALUES (?, ?, ?, ?, ?)`,
            [numerocheque, valor, empresa, contato, usuario]
        )

        return res.status(201).json({ message: "Cheque cadastrado com sucesso"});
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

})

router.get("/lista", authMiddleware, statusMiddleware, async (req, res) => {
    try {
        const { usuario, tipo_usuario } = req.user;

        let query = `SELECT numerocheque, valor, empresa, data, contato, gerencia_usuario FROM cheque `;

        let params = [];

        if(tipo_usuario !== "gerente") {
            query += " WHERE gerencia_usuario = ?";
            params.push(usuario);
        }

        const [rows] = await pool.query(query, params);
        return res.json(rows);
    } catch(err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

export default router;