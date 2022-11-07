const fsPromises = require('fs/promises');
const path = require('path');

const getPath = (filename) => path.join(__dirname, filename);

// добавляем async await, чтобы избавиться от callback hell
async function copyDir(newDirPath, cpyDirPath) {
    // очищаем всю директорию рекурсией 
    await fsPromises.rm(newDirPath, {recursive: true, force: true})

    // создаем нашу копию директории
    await fsPromises.mkdir(newDirPath, {recursive: true})

    // считываем все файлы с директории files
    const files = await fsPromises.readdir(cpyDirPath)
    // циклом проходим по всем файлам и копируем их в copy-files
    for(let file of files) {
        await fsPromises.copyFile(path.join(cpyDirPath, file), path.join(newDirPath, file))
    }
}
copyDir(getPath('files-copy'), getPath('files'))