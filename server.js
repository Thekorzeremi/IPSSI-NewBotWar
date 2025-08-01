const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/control', (req,res) => {
    fs.writeFileSync('lastCommand.json', JSON.stringify(req.body));
    res.send({ success: true });
});

app.get('/action', (req, res) => {
    let command;
    try {
        if (!fs.existsSync('lastCommand.json')) {
            command = { move: "UP", action: "NONE" };
            fs.writeFileSync('lastCommand.json', JSON.stringify(command));
            return res.json(command);
        }

        const raw = fs.readFileSync('lastCommand.json', 'utf-8');
        if (!raw) {
            command = { move: "UP", action: "NONE" };
            fs.writeFileSync('lastCommand.json', JSON.stringify(command));
            return res.json(command);
        }

        command = JSON.parse(raw);

        if (!command.move || !command.action) {
            command = { move: "UP", action: "NONE" };
            fs.writeFileSync('lastCommand.json', JSON.stringify(command));
            return res.json(command);
        }

        res.json(command);

    } catch (e) {
        command = { move: "UP", action: "NONE" };
        fs.writeFileSync('lastCommand.json', JSON.stringify(command));
        res.json(command);
    }
});


if (require.main === module) {
    fs.writeFileSync('lastCommand.json', JSON.stringify({ move: "UP", action: "NONE" }));
    app.listen(PORT, () => {
        console.log(`Le bot est lancé sur http://127.0.0.1:${PORT}`);
    });
}

module.exports = app;