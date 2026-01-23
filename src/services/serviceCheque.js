import pool from "../database/database.js";

export async function criarChequeService({numerocheque, valor, empresa, contato, usuario}) {
    
    const [exists] = await pool.query(
        "SELECT numerocheque FROM cheque WHERE numerocheque = ?",
        [numerocheque]
    );

    if(exists.length > 0) {
        throw new Error("Cheque já cadastrado");
    }

    await pool.query(
        `INSERT INTO cheque 
        (numerocheque, valor, empresa, contato, gerencia_usuario) 
        VALUES (?, ?, ?, ?, ?)`,
        [numerocheque, valor, empresa, contato, usuario]
    );

}

export async function listarChequeService() {
    
    const [rows] = await pool.query(
        `SELECT numerocheque, valor, empresa, data, contato, gerencia_usuario, status_cheque
        FROM cheque`
    )

    return rows;
}

export async function editarChequeService({ numero, valor, empresa, contato }) {
    
    const [rows] = await pool.query(
        "SELECT numerocheque FROM cheque WHERE numerocheque = ?",
        [numero]
    );

    if (rows.length === 0) {
        throw new Error("Cheque não encontrado");
    }

    await pool.query(
        `UPDATE cheque
        SET valor = ?, empresa = ?, contato = ?
        WHERE numerocheque = ?`,
        [valor, empresa, contato, numero]
    );

}

export async function atualizarStatusChequeService({ numero, status }) {
    
    const statusPermitidos = ["recebido", "guardado", "depositado"];

    if(!status || !statusPermitidos.includes(status)) {
        throw new Error("Status inválido");
    }

    const [rows] = await pool.query(
        "SELECT status_cheque FROM cheque WHERE numerocheque = ?", [numero]
    );

    if (rows.length === 0) {
        throw new Error("Cheque não encontrado");
    }

    const statusAtual = rows[0].status_cheque;

    const transicoes = {
        recebido: ["guardado"],
        guardado: ["depositado"],
        depositado: []
    };

    if (!transicoes[statusAtual].includes(status)) {
        throw new Error(`Transição inválida: ${statusAtual} -> ${status}`);
    }

    await pool.query(
        "UPDATE cheque SET status_cheque = ? WHERE numerocheque = ?",
        [status, numero]
    );
}

export async function deletarChequeService(numero) {
    
    const [rows] = await pool.query(
        "SELECT numerocheque FROM cheque WHERE numerocheque = ?",
        [numero]
    );

    if (rows.length === 0) {
        throw new Error("Cheque não encontrado");
    }

    await pool.query(
        "DELETE FROM cheque WHERE numerocheque = ?",
        [numero]
    );

}