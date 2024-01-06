const express = require('express');
const path = require('path');
const server = express();

server.use(express.static(path.join(__dirname, 'dist')));

server.get('/admin/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(9001, (err) => {
    if (err) throw err
    console.log(`> Aye http://localhost:${9001}`)
})