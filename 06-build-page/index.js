const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const getPath = (filename) => path.join(__dirname, filename)

async function buildNewPage(inputFolder, outputFolder) {
  // создаем нашу копию директории
  await fsPromises.mkdir(outputFolder, {recursive: true})
  // добавляем async await, чтобы избавиться от callback hell
  const copyDir = async (inputFolder, outputFolder) => {
    // считываем все файлы с директории files
    const files = await fsPromises.readdir(inputFolder, { withFileTypes: true })
    // циклом проходим по всем файлам и копируем их в новую директорию
    for(let file of files) {
      if(file.isFile()) {
        await fsPromises.copyFile(path.join(inputFolder, file.name), path.join(outputFolder, file.name))
      }
      else {
        let deepCpyDirPath = path.join(inputFolder, file.name)
        let deepNewdirPath = path.resolve(inputFolder, outputFolder, file.name)
        await fsPromises.mkdir(deepNewdirPath, {
            recursive: true
        })
        copyDir(deepCpyDirPath, deepNewdirPath)
      }
    }
  }

  const cssFiles = await fsPromises.readdir(getPath("styles"))
  const output = fs.createWriteStream(path.join(outputFolder, 'style.css'))
  for(let file of cssFiles) {
    // считываем с каждого файла с расширением .css содержимое
    const styleFile = fs.createReadStream(path.join(getPath("styles"), file), 'utf-8')
    // добавляем то, что считали в bundle
    styleFile.on('data', chunk => output.write(`${chunk}\n`))
  }

  const componentsHtml = {}
  const components = await fsPromises.readdir(getPath('components'))
  for(let component of components) {
    componentsHtml[`{{${path.parse(component).name}}}`] = (await fsPromises.readFile(path.join(getPath('components'), component))).toString()
  }
  
  const componentsToBeReplaced = Object.keys(componentsHtml)
  const inputHtml = fs.createReadStream(getPath('template.html'))
  const outputHtml = fs.createWriteStream(path.join(outputFolder, 'index.html'))
  const rl = readline.createInterface({
      input: inputHtml,
      output: outputHtml
  });
  rl.on('line', line => {
    for(let component of componentsToBeReplaced) {
      if(component === line.trim()) {
        line = line.replace(line.trim(), componentsHtml[component])
      }
    }
    outputHtml.write(`${line}\n`);
  });

  copyDir(getPath('assets'), path.join(outputFolder, 'assets'))
}

buildNewPage(__dirname, getPath('project-dist'))