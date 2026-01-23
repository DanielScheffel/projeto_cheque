import { atualizarUsuarioService, deletarUsuarioService } from "../services/usuarioService.js";


export async function atualizarUsuarioController(req, res) {

    const { usuario, status, tipo_usuario, senha } = req.body;

    try {
        if(!usuario) return res.status(400).json({ message: "Campo 'usuario' obrigatório" });

        const resultado = await atualizarUsuarioService({ usuario, status, tipo_usuario, senha });
        return res.json(resultado);
    } catch(err) {
        if(err.message.includes("não encontrado") || err.message.includes("inválido") || err.message.includes("Nenhum campo")){
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }

}

export async function deletarUsuarioController(req, res) {
    
    const { usuario } = req.params;

    try {
        const resultado = await deletarUsuarioService(usuario);
        return res.json(resultado);
    } catch(err) {
        if(err.message.includes("não encontrado")){
            return res.status(404).json({ message: err.message });
        }
        return res.status(500).json({ message: err.message });
    }

}