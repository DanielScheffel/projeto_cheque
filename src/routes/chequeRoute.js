import express from "express";
import pool from "../database/database.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { statusMiddleware } from "../middlewares/statusMiddleware.js";
import { gerenteMiddleware } from "../middlewares/gerenteMiddleware.js";
import { atualizarStatusChequeController, 
  criarChequeController,
  deletarChequeController, 
  editarChequeController, 
  listarChequeController 
} from "../controllers/chequeController.js";


const router = express.Router();

router.post("/criar",
    authMiddleware,
    statusMiddleware,
    criarChequeController

)

router.get("/lista",
  authMiddleware,
  statusMiddleware,
  listarChequeController
);

router.put("/:numero/editar",
  authMiddleware,
  statusMiddleware,
  gerenteMiddleware,
  editarChequeController
);


router.put("/:numero/status",
    authMiddleware,
    statusMiddleware,
    gerenteMiddleware,
    atualizarStatusChequeController
)

router.delete("/:numero/deletar",
    authMiddleware,
    statusMiddleware,
    gerenteMiddleware,
    deletarChequeController

);


export default router;