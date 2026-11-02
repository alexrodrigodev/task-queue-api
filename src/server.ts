import express from 'express';
import { setupDatabase } from './database.js';

const app = express();
app.use(express.json());

setupDatabase().then((db) => {
    
  
    app.post('/jobs', async (req, res) => {
        const { type, payload } = req.body;
        const id = `job_${Date.now()}`;
        const payloadString = JSON.stringify(payload);

        try {
            await db.run(
                'INSERT INTO jobs (id, type, payload) VALUES (?, ?, ?)',
                [id, type, payloadString]
            );

            res.status(201).json({ 
                message: 'Tarefa enfileirada!', 
                jobId: id,
                status: 'PENDING'
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao enfileirar a tarefa' });
        }
    });

  
    app.get('/jobs/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const job = await db.get("SELECT * FROM jobs WHERE id = ?", [id]);

            if (!job) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }

            res.json({
                jobId: job.id,
                type: job.type,
                status: job.status,
                createdAt: job.created_at
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao consultar a tarefa' });
        }
    });


    setInterval(async () => {
        try {
         
            const job = await db.get("SELECT * FROM jobs WHERE status = 'PENDING' ORDER BY created_at ASC LIMIT 1");

            if (job) {
                console.log(`\n⚙️ A processar tarefa ${job.id} (Tipo: ${job.type})...`);

              
                await db.run("UPDATE jobs SET status = 'PROCESSING' WHERE id = ?", [job.id]);

              
                setTimeout(async () => {
          
                    await db.run("UPDATE jobs SET status = 'COMPLETED' WHERE id = ?", [job.id]);
                    console.log(`✅ Tarefa ${job.id} concluída com sucesso!`);
                }, 4000); 
            }
        } catch (error) {
            console.error("Erro no worker:", error);
        }
    }, 3000);


    app.listen(3000, () => {
        console.log('🚀 Servidor da Fila a rodar na porta 3000!');
    });
});