import "dotenv/config";
import express from "express";
import pool from "../database/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cadastro", async (req, res) => {
    const { name, password, usuario, status } = req.body;

    try {
        if(!name || !password || !usuario || !status) {
            return res.status(400).json({ message: "Nome, senha, usuario e status são obrigatórios"});
        }

        const statusPermission = ["ativo", "inativo"];
        if(!statusPermission.includes(status)) {
            return res.status(400).json({
                message: 'Status inválido. Use "ativo" ou "inativo"'
            });
        }

        const [rows] = await pool.query("SELECT usuario FROM gerencia WHERE nome = ?", [name]);

        if(rows.length > 0){
            return res.status(409).json({ message : "Usuário já existe" });
        }

        const senhaHash = await bcrypt.hash(password, 10);

        await pool.query(`INSERT INTO gerencia (usuario, status, senha, nome) VALUES (?, ?, ?, ?)`, [usuario, status, senhaHash, name]);

        return res.status(201).json({
            message: "Usuário registrado com sucesso"
        })
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
})

router.post("/login", async (req, res) => {
    const {name, password} = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM gerencia WHERE nome = ?", [name])
        if(rows.length === 0) {
            return res.status(404).json({message : "Usuário não existe"})
        }
        
        const user = rows[0];

        if(user.status !== "ativo"){
            return res.status(403).json({
                message: "Usuário inativo. Contate o gerente."
            })
        }

        const passValid = await bcrypt.compare(password, user.senha);
        if(!passValid) {
            return res.status(401).json({ message : "Senha inválida"})
        }

        const token = jwt.sign({
            usuario: user.usuario,
            nome: user.nome
        }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES })

        return res.json({ message : "Login realizado com sucesso", token})
    } catch(err) {
        return res.status(500).json(err.message)
    }
})

router.get("/me", authMiddleware, (req, res) => {
    return res.json({
        message: "Acesso autorizado",
        user: req.user
    });
});

export default router;