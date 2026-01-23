import "dotenv/config";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { gerenteMiddleware } from "../middlewares/gerenteMiddleware.js";
import { statusMiddleware } from "../middlewares/statusMiddleware.js";
import { cadastroUsuarioController, 
    loginUsuarioController 
} from "../controllers/authController.js";
import { atualizarUsuarioController, deletarUsuarioController } from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/cadastro",
    authMiddleware,
    gerenteMiddleware,
    statusMiddleware,
    cadastroUsuarioController
)

router.post("/login", 
    loginUsuarioController
)

router.get("/me", authMiddleware, (req, res) => {
    return res.json({
        message: "Acesso autorizado",
        user: req.user
    });
});

router.put("/atualizar", 
    authMiddleware,
    gerenteMiddleware,
    atualizarUsuarioController
);

router.delete("/deletar/:usuario",
    authMiddleware,
    gerenteMiddleware,
    deletarUsuarioController
)

export default router;