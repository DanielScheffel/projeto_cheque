import { criarChequeService } from "../services/serviceCheque.js";

export async function criarChequeController(req, res) {
    const { numerocheque, valor, empresa, contato } = req.body;
    const usuario = req.user.usuario;

    if(!numerocheque || !valor || !empresa || !contato ) {
        return res.status(400).json({
            message: "Todos os campos são obrigatórios"
        });
    }

    try {
        await criarChequeService({
            numerocheque, valor, empresa, contato, usuario
        })

        return res.status(201).json({
            message: "Cheque cadastrado com sucesso"
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        })
    }
}