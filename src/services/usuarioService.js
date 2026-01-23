import { pool } from "../database/database.js";
import bcrypt from "bcryptjs";

export async function atualizarUsuarioService({ usuario, status, tipo_usuario, senha }) {
    
    const [rows] = await pool.query("SELECT * FROM gerencia WHERE usuario = ?", [usuario]);

    if(rows.length === 0){
        throw new Error("Usuário não encontrado");
    }

    const updates = [];
    const values = [];

    if(status){
        if(!["ativo","inativo"].includes(status)){
            throw new Error('Status inválido. Use "ativo" ou "inativo"');
        }
        updates.push("status = ?");
        values.push(status);
    }

    if(tipo_usuario){
        if(!["gerente","usuario"].includes(tipo_usuario)){
            throw new Error("Tipo de usuário inválido");
        }
        updates.push("tipo_usuario = ?");
        values.push(tipo_usuario);
    }

    if(senha){
        const senhaHash = await bcrypt.hash(senha, 10);
        updates.push("senha = ?");
        values.push(senhaHash);
    }

    if(updates.length === 0){
        throw new Error("Nenhum campo para atualizar");
    }

    values.push(usuario);

    await pool.query(`UPDATE gerencia SET ${updates.join(", ")} WHERE usuario = ?`, values);

    return { message: "Usuário atualizado com sucesso" };
}

export async function deletarUsuarioService(usuario) {

    const [rows] = await pool.query("SELECT * FROM gerencia WHERE usuario = ?", [usuario]);
    if(rows.length === 0){
        throw new Error("Usuário não encontrado");
    }

    await pool.query("DELETE FROM gerencia WHERE usuario = ?", [usuario]);
    return { message: "Usuário deletado com sucesso" };

}