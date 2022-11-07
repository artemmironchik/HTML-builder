const fs = require('fs');
const path = require('path');

const getPath = (filename) => path.join(__dirname, filename);

const readableStream = fs.createReadStream(getPath('text.txt'), 'utf-8');
readableStream.on('data', chunk => console.log(chunk));