import request from 'supertest';
import { query } from '../src/db'; // Mocked db query
import { Duty } from '../src/models/Duty'; // Mocked model
import { app, server } from '../src/app'; // Assuming the Express app is exported

// Mock the db query method
jest.mock('../src/db', () => ({
    query: jest.fn(),
}));

describe('Duties API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Close the server after all tests
    afterAll((done) => {
        server.close(done);  // This ensures that the server is properly closed after the tests
    });

    // Test for GET /api/duties
    describe('GET /api/duties', () => {
        it('should return all duties', async () => {
            const mockDuties = [{ id: 1, name: 'Test Duty' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockDuties });

            const response = await request(app).get('/api/duties');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDuties);
            expect(query).toHaveBeenCalledWith('SELECT * FROM duties');
        });

        it('should return 500 on database error', async () => {
            (query as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/duties');
            expect(response.status).toBe(500);
            expect(response.body).toEqual([]);
        });
    });

    // Test for POST /api/duties
    describe('POST /api/duties', () => {
        it('should create a new duty', async () => {
            const newDuty: Duty = { id: '1', name: 'New Duty' };
            (query as jest.Mock).mockResolvedValue({ rows: [newDuty] });

            const response = await request(app).post('/api/duties').send({ name: 'New Duty' });
            expect(response.status).toBe(201);
            expect(response.body).toEqual(newDuty);
            expect(query).toHaveBeenCalledWith('INSERT INTO duties (name) VALUES ($1) RETURNING *', ['New Duty']);
        });

        it('should return 500 on database error', async () => {
            (query as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/api/duties').send({ name: 'New Duty' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual([]);
        });
    });

    // Test for PUT /api/duties/:id
    describe('PUT /api/duties/:id', () => {
        it('should update a duty', async () => {
            const updatedDuty = { id: 1, name: 'Updated Duty' };
            (query as jest.Mock).mockResolvedValue({ rows: [updatedDuty] });

            const response = await request(app).put('/api/duties/1').send({ name: 'Updated Duty' });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedDuty);
            expect(query).toHaveBeenCalledWith('UPDATE duties SET name = $1 WHERE id = $2 RETURNING *', ['Updated Duty', '1']);
        });

        it('should return 404 if duty is not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const response = await request(app).put('/api/duties/999').send({ name: 'Non-existent Duty' });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Duty not found' });
        });

        it('should return 500 on database error', async () => {
            (query as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).put('/api/duties/1').send({ name: 'Updated Duty' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Error' });
        });
    });

    // Test for DELETE /api/duties/:id
    describe('DELETE /api/duties/:id', () => {
        it('should delete a duty', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [{ id: 1, name: 'Duty to Delete' }] });

            const response = await request(app).delete('/api/duties/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Duty deleted' });
            expect(query).toHaveBeenCalledWith('DELETE FROM duties WHERE id = $1 RETURNING *', ['1']);
        });

        it('should return 404 if duty is not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const response = await request(app).delete('/api/duties/999');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Duty not found' });
        });

        it('should return 500 on database error', async () => {
            (query as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/api/duties/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Error' });
        });
    });
});
