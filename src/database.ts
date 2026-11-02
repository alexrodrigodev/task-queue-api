import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function setupDatabase() {
    // Cria um ficheiro queue.sqlite para guardar as tarefas
    const db = await open({
        filename: './queue.sqlite',
        driver: sqlite3.Database
    });

    // Cria a tabela de trabalhos (jobs) se não existir
    await db.exec(`
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            payload TEXT NOT NULL,
            status TEXT DEFAULT 'PENDING',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("📦 Base de dados da Fila inicializada com sucesso!");
    return db;
}