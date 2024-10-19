import { Pool } from 'pg';

const pool = new Pool({
    user: 'myuser',
    host: 'localhost',
    database: 'mydb',
    password: 'mypassword',
    port: 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
