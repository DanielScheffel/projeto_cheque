import { cadastrarUsuarioService, 
    loginUsuarioService 
} from "../services/authService.js";


export async function cadastroUsuarioController(req, res) {

    const { name, password, usuario, status, tipo_usuario } = req.body;

    try {
        if(!name || !password || !usuario || !status || !tipo_usuario) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        const result = await cadastrarUsuarioService({ name, password, usuario, status, tipo_usuario });

        return res.status(201).json(result);
    } catch(err) {
        if (err.message === "Usuário já existe" || err.message.includes("inválido")) {
            return res.status(400).json({ message: err.message });
        }

        return res.status(500).json({ error: err.message });
    }

}

export async function loginUsuarioController(req, res) {
    const { name, password } = req.body;

    try {
        if(!name || !password) {
            return res.status(400).json({ message: "Nome e senha são obrigatórios" });
        }

        const resultado = await loginUsuarioService({ name, password });
        return res.json(resultado);

    } catch(err) {
        if(err.message === "Usuário não existe") {
            return res.status(404).json({ message: err.message });
        }

        if(err.message === "USUARIO_INATIVO") {
            return res.status(403).json({ message: "Usuário inativo. Contate o gerente." });
        }

        if(err.message === "Senha inválida") {
            return res.status(401).json({ message: err.message });
        }

        return res.status(500).json({ message: err.message });
    }
}