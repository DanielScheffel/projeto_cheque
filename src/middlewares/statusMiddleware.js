import pool from "../database/database.js";

export async function statusMiddleware(req, res, next) {
    try {
        const usuario = req.user.usuario;

        const [rows] = await pool.query("SELECT status FROM gerencia WHERE usuario = ?", [usuario]);

        if (rows.length === 0) {
            return res.status(403).json({
            message: "Usuário não encontrado"
            });
        }

        if(rows[0].status !== "ativo") {
            return res.status(403).json({
                message: "Usuário inativo"
            })
        }
        return next();

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}