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

app.get('/action', (req,res) => {
    const raw = fs.readFileSync('lastCommand.json');
    const command = JSON.parse(raw);
    res.json(command);
});

app.listen(PORT, () => {
    console.log(`Le bot est lancé sur http://127.0.0.1:${PORT}`);
});