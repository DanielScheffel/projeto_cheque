import pool from "../database/database.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function cadastrarUsuarioService({ name, password, usuario, status, tipo_usuario }) {
    
    // Validação de status
    if(!["ativo", "inativo"].includes(status)) {
        throw new Error('Status inválido. Use "ativo" ou "inativo"')
    }

    // Validação de tipo de usuário
    if(!["gerente", "usuario"].includes(tipo_usuario)) {
        throw new Error("Tipo de usuário inválido");
    }

    // Verifica se o usuário já existe
    const [rows] = await pool.query("SELECT usuario FROM gerencia WHERE usuario = ?", [usuario]);
    if(rows.length > 0){
        throw new Error("Usuário já existe");
    }

    const senhaHash = await bcrypt.hash(password, 10);

    await pool.query(
        `INSERT INTO gerencia (usuario, status, senha, nome, tipo_usuario) VALUES (?, ?, ?, ?, ?)`, 
        [usuario, status, senhaHash, name, tipo_usuario]
    );

    return { message: "Usuário cadastrado com sucesso"};

}

export async function loginUsuarioService({ name, password }) {
    // Busca usuário pelo nome
    const [rows] = await pool.query("SELECT * FROM gerencia WHERE nome = ?", [name]);
    if(rows.length === 0) {
        throw new Error("Usuário não existe");
    }

    const user = rows[0];

    // Verifica status do usuário
    if(user.status !== "ativo"){
        throw new Error("USUARIO_INATIVO");
    }

    // Valida senha
    const passValid = await bcrypt.compare(password, user.senha);
    if(!passValid) {
        throw new Error("Senha inválida");
    }

    // Gera token JWT
    const token = jwt.sign(
        {
            usuario: user.usuario,
            tipo_usuario: user.tipo_usuario
        },
        process.env.JWT_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );

    return { message: "Login realizado com sucesso", token };
}