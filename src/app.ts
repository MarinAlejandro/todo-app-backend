import express, { Request, Response } from 'express';
import { query } from './db';
import { Duty } from './models/Duty';

export const app = express();
const port = 3000;

app.use(express.json());

// Get all duties
app.get('/api/duties', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM duties');
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json([]);
    }
});

// Create a new duty
app.post('/api/duties', async (req: Request, res: Response) => {
    const { name } = req.body as Duty;
    try {
        const result = await query('INSERT INTO duties (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json([]);
    }
});

// Update a duty
app.put('/api/duties/:id', async (req: Request, res: any) => {
    const { id } = req.params;
    const { name } = req.body as Duty;
    try {
        const result = await query('UPDATE duties SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Duty not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

// Delete a duty
app.delete('/api/duties/:id', async (req: Request, res: any) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM duties WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Duty not found' });
        }
        res.status(200).json({ message: 'Duty deleted' });
    } catch (error) {
        res.status(500).json({ error: "Error" });
    }
});

// Start the server
export const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});