const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('./server');

const filePath = path.resolve(__dirname, 'lastCommand.json');

describe('GET /action', () => {

    afterEach(() => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });

    it('doit retourner move=UP et action=NONE par défaut si fichier absent', async () => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const res = await request(app).get('/action');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ move: "UP", action: "NONE" });

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(data).toEqual({ move: "UP", action: "NONE" });
    });

    it('doit retourner la commande du fichier si valide', async () => {
        const cmd = { move: "DOWN", action: "NONE" };
        fs.writeFileSync(filePath, JSON.stringify(cmd));

        const res = await request(app).get('/action');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(cmd);
    });

    it('doit réinitialiser et retourner valeur par défaut si JSON invalide', async () => {
        fs.writeFileSync(filePath, '{ invalid json');

        const res = await request(app).get('/action');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ move: "UP", action: "NONE" });

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(data).toEqual({ move: "UP", action: "NONE" });
    });

    it('doit réinitialiser et retourner valeur par défaut si move ou action manquant', async () => {
        fs.writeFileSync(filePath, JSON.stringify({ move: "LEFT" }))

        const res = await request(app).get('/action');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ move: "UP", action: "NONE" });

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        expect(data).toEqual({ move: "UP", action: "NONE" });
    });
});
