import { 
    atualizarStatusChequeService, 
    criarChequeService, 
    deletarChequeService, 
    editarChequeService, 
    listarChequeService 
} from "../services/serviceCheque.js";

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

export async function listarChequeController(req, res) {
    try {
        const cheques = await listarChequeService();
        return res.json(cheques)
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

export async function editarChequeController(req, res) {
    
    const { numero } = req.params;
    const { valor, empresa, contato } = req.body;

    if(!valor || !empresa || !contato ) {
        return res.status(400).json({
            message: "Todos os campos são obrigatórios"
        });
    }

    try {
        await editarChequeService({ numero, valor, empresa, contato });

        return res.json({
            message: "Cheque atualizado com sucesso"
        });
    } catch (err) {
        return res.status(404).json({
            message: err.message
        });
    }

}

export async function atualizarStatusChequeController(req, res) {
    
    const { numero } = req.params;
    const { status } = req.body;

    try {
        await atualizarStatusChequeService({
            numero,
            status
        });

        return res.json({
            message: `Status do cheque atualizado para ${status}`
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }

}

export async function deletarChequeController(req, res) {
    
    const { numero } = req.params;

    try {
        await deletarChequeService(numero);

        return res.json({
            message: "Cheque removido com sucesso"
        });
    } catch (err) {
        if(err.message === "Cheque não encontrado") {
            return res.status(404).json({ message: err.message });
        }

        return res.status(500).json({
            message: err.message
        });
    }

}