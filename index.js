const TelegramApi = require('node-telegram-bot-api')
const {gameOptions,againOptions } = require ('./options')

const token = '7078327343:AAEn1fRS7A9p5IHjNtWv6d7DSmEIUtnmIDM'
const bot = new TelegramApi(token, {polling: true})
const chats = {}



const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!')
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'}
    ])
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/2.webp');
            return bot.sendMessage(chatId, `Добро пожаловать в этот бот ${msg.from.first_name}`);

        }
        if (text === '/info') {
            if (msg.from.last_name === undefined) {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
            } else {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
            }

        }



        if (text === '/game') {
            return startGame(chatId);

        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
           return startGame(chatId)

        }
        if(data === chats [chatId]){
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats [chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загазад цифру ${chats [chatId]} `, againOptions)
        }


    })
}
start()