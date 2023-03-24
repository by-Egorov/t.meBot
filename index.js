const TelegramApi = require('node-telegram-bot-api')
const axios = require('axios')
const {gameOptions, againOptions} = require('./options')
const token = '5945959235:AAHW3u7DFtW1Z3yOz74na-eJ7d2gU6xzhR8'
const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал цифру от 0 до 9, попробуй её отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    console.log(randomNumber)
    await bot.sendMessage(chatId, 'Отгадывай!', gameOption)
}
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/weather', description: 'Узнать погоду'},
        {command: '/game', description: 'Игра - Угадай цифру'}
    ])

    bot.on('message',
        async msg => {
            const text = msg.text;
            const chatId = msg.chat.id;
            const local = msg.location
            // console.log(msg)

            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.jpg')
                return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот EgorovDev`)
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, ` Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
            }
            if (text === '/weather') {
                return bot.sendMessage(chatId, `Пожалуйста скиньте свою геолокацию, что бы узнать какая температура в вашем городе`)
            }
            if (local) {
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${msg.location.latitude}&lon=${msg.location.longitude}&lang=ru&units=metric&appid=85c5b65068d16d4e0cecd77e1e523980`
                const response = await axios.get(weatherApiUrl)
                return bot.sendMessage(chatId, `Сейчас  ${response.data.main.temp}℃`)
            }
            if (text === '/game') {
              return  startGame(chatId)
            }
            return bot.sendMessage(chatId, `Я тебя не помнимаю, попробуй еще раз!`)

        })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
          return  startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Молодец, угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Увы, но я загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()
