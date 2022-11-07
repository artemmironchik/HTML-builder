const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');

const getPath = (filename) => path.join(__dirname, filename);
// создаем файл, где будет наш css
const output = fs.createWriteStream(getPath('project-dist/bundle.css'))

// добавляем async await, чтобы избавиться от callback hell
async function mergeStyles(stylesDir) {
    const files = await fsPromises.readdir(stylesDir)

    for(let file of files) {
        if(path.parse(file).ext === ".css") {
            // считываем с каждого файла с расширением .css содержимое
            const styleFile = fs.createReadStream(path.join(stylesDir, file), 'utf-8')
            // добавляем то, что считали в bundle
            styleFile.on('data', chunk => output.write(`${chunk}\n`))
        }
    }
}

mergeStyles(getPath('styles'))