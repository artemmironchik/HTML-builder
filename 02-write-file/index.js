const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const getPath = (filename) => path.join(__dirname, filename);

const rl = readline.createInterface({ input, output })

rl.write('Привет ! Напиши какой-нибудь текст\n')
// создаем файл text.txt
fs.writeFile(
    getPath('text.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);
// тернарный оператор для проверки ввели ли exit
// если ввели, вызываем close, если нет - то записываем в файл то, что ввели
rl.on('line', input => (input === 'exit') ? rl.close() :
  fs.appendFile(getPath('text.txt'), `${input}\n`, (err) => {
    if(err) throw err
  })).on('close', () => { // остановка процесса
      rl.write('Процесс остановлен. До свидания !')
      process.exit()
})



