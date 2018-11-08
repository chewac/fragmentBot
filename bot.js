const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')


const splitTextToFragments = text => text.split(/\n\s*\n/).map(fragment => fragment.trim());

class FragmentBot {
    constructor(token) {
        this.token = token;
    }

    run(filename) {
        console.log('Читаю: ' + filename);
        fs.readFile(filename, 'utf8', (err, text) => {
            if (err) throw err;

            console.log('Разделяю на части');
            let fragments = splitTextToFragments(text);
          
            console.log('Частей: ' + fragments.length);
            const getFragmentByNum = num => (num > 0 && num <= fragments.length) ? fragments[num] : null;

            console.log('Запускаю бота!');
            const bot = new TelegramBot(this.token, {polling: true});

            bot.onText(/(\d+)/, (msg, match) => {
                const num = parseInt(match[1]);
                let text = getFragmentByNum(num) || 'Не знаю!';
                console.log(num);
                console.log(text);
                console.log('');
                bot.sendMessage(msg.chat.id, text);
            });
        })   
    }
}


module.exports = FragmentBot;