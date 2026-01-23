import express from "express";
import pool from "../database/database.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { statusMiddleware } from "../middlewares/statusMiddleware.js";
import { gerenteMiddleware } from "../middlewares/gerenteMiddleware.js";
import { criarChequeController } from "../controllers/chequeController.js";


const router = express.Router();

router.post("/criar",
    authMiddleware,
    statusMiddleware,
    criarChequeController

)

router.get("/lista", authMiddleware, statusMiddleware, async (req, res) => {
    try {
            const [rows] = await pool.query(
                `SELECT numerocheque, valor, empresa, data, contato, gerencia_usuario, status_cheque
                FROM cheque`
            )

            return res.json(rows);
    } catch(err) {
        return res.status(500).json({
            message: err.message
        })
    }
})

router.put(
  "/:numero/editar",
  authMiddleware,
  statusMiddleware,
  gerenteMiddleware,
  async (req, res) => {
    const { numero } = req.params;
    const { valor, empresa, contato } = req.body;

    try {
      const [rows] = await pool.query(
        "SELECT numerocheque FROM cheque WHERE numerocheque = ?",
        [numero]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Cheque não encontrado" });
      }

      await pool.query(
        `UPDATE cheque
         SET valor = ?, empresa = ?, contato = ?
         WHERE numerocheque = ?`,
        [valor, empresa, contato, numero]
      );

      return res.json({ message: "Cheque atualizado com sucesso" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);


router.put("/:numero/status", authMiddleware, statusMiddleware, gerenteMiddleware, async (req, res) => {
    
    const { numero } = req.params;
    const { status } = req.body;

    try {
        
        const statusPermitidos = ["recebido", "guardado", "depositado"];

        if(!status || !statusPermitidos.includes(status)) {
            return res.status(400).json({
                message: "Status inválido"
            });
        }

        const [rows] = await pool.query(
            "SELECT status_cheque FROM cheque WHERE numerocheque = ?", [numero]
        );

        if(rows.length === 0){
            return res.status(404).json({
                message: "Cheque não encontrado"
            })
        }

        const statusAtual = rows[0].status_cheque;

        const transicoes = {
            recebido: ["guardado"],
            guardado: ["depositado"],
            depositado: []
        }

        if(!transicoes[statusAtual].includes(status)) {
            return res.status(400).json({
                message: `Transição inválida: ${statusAtual} -> ${status}`
            })
        }

        await pool.query(
            "Update cheque SET status_cheque = ? WHERE numerocheque = ?", [status, numero]
        );

        return res.json({
            message: `Status do cheque atualizado para ${status}`
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

})

router.delete(
  "/:numero/deletar",
  authMiddleware,
  statusMiddleware,
  gerenteMiddleware,
  async (req, res) => {
    const { numero } = req.params;

    try {
      const [rows] = await pool.query(
        "SELECT numerocheque FROM cheque WHERE numerocheque = ?",
        [numero]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Cheque não encontrado" });
      }

      await pool.query(
        "DELETE FROM cheque WHERE numerocheque = ?",
        [numero]
      );

      return res.json({ message: "Cheque removido com sucesso" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
);


export default router;