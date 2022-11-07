const fsPromises = require('fs/promises');
const path = require('path');

const getPath = (filename) => path.join(__dirname, filename);

// добавляем async await, чтобы избавиться от callback hell
async function filesInFolder(folderPath) {
    // читаем файлы из директории
    const files = await fsPromises.readdir(getPath(folderPath), {withFileTypes: true})

    for(let file of files) {
        // проверка на то, является ли file файлом
        if(file.isFile()) {
            // информация о файле и ее вывод
            const fileStats = await fsPromises.stat(path.join(getPath(folderPath), file.name))
            console.log(`${path.parse(file.name).name} - ${path.parse(file.name).ext.slice(1)} - ${fileStats.size / 1024}kb`)
        }
    }
}

filesInFolder('secret-folder')

