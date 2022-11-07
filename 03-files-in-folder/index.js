const fs = require('fs');
const path = require('path');

const getPath = (filename) => path.join(__dirname, filename);

// читаем файлы из директории
fs.readdir(getPath('secret-folder'), {withFileTypes: true}, (err, files) => {
    if(err) throw err

    else {
        // пробегаемся по всем файлам
        files.forEach((file) => {
            // проверка на то, является ли file файлом
            if(file.isFile()) {
                // информация о файле и ее вывод
                fs.stat(path.join(getPath('secret-folder'), file.name), (err, stats) => {
                    console.log(`${path.parse(file.name).name} - ${path.parse(file.name).ext.slice(1)} - ${stats.size / 1024}kb`)
                })
            }
        })
    }
})