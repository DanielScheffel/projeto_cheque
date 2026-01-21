import pool from "../database/database.js";

export async function gerenteMiddleware(req, res, next) {
    try {
        const userId = req.user.usuario;

        const [rows] = await pool.query(
            "SELECT status, tipo_usuario FROM gerencia WHERE usuario = ?", [userId]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        const gerente = rows[0];

        if(gerente.status !== "ativo"){
            return res.status(403).json({
                message: "Usuário inativo."
            });
        } 

        if(gerente.tipo_usuario !== "gerente") {
            return res.status(403).json({
                message: "Acesso permitido apenas para gerente"
            })
        }

        return next();
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}