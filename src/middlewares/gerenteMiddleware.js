import pool from "../database/database.js";

export async function gerenteMiddleware(req, res, next) {
    try {
        const userId = req.user.usuario;

        const [rows] = await pool.query(
            "SELECT tipo_usuario FROM gerencia WHERE usuario = ?", [userId]
        )


        if(rows.length === 0 || rows[0].tipo_usuar !== "gerente") {
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