import TelegramBot from "node-telegram-bot-api";

const token = '7212574945:AAErOhTNBW5dnBWgJfyfPKAnddwM1Y0DTTk';
const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
    console.error(error);
});

bot.on('polling_enabled', () => {
    bot.setMyCommands([
        { command: 'start', description: 'Start the bot' },
        // { command: 'whats', description: 'Send a file' }
        // Add more commands here
    ], {
        language_code: 'en'
    }).catch((error) => {
        console.error(error);
    });
});

let num1 = '';
let num2 = '';
let operator = '';
let command = ''

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const menu = [
        [{ text: 'x' }, { text: '÷' }],
        [{ text: '+' }, { text: '-' }],
    ];

    // Process the incoming message here
    if (messageText.startsWith('/')) {
        command = messageText;
        if (messageText === '/start') {
            bot.sendMessage(chatId, 'Welcome to the CALCULATOR!\nSend me a number:');
        }
    }

    if (command === '/start') {
        if (!isNaN(messageText)) {
            if (num1 === '') {
                num1 = messageText;
                bot.sendMessage(chatId, 'Select a operator:', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'x', callback_data: 'x' }, { text: '÷', callback_data: '÷' }],
                            [{ text: '+', callback_data: '+' }, { text: '-', callback_data: '-' }],
                        ]
                    }
                });

            } else {
                num2 = messageText;
                const res = calculat(num1, messageText, operator);
                console.log(res);

                bot.sendMessage(chatId, res).then((result) => {
                    num1 = '';
                    num2 = '';
                    operator = '';
                    bot.sendMessage(chatId, 'Welcome to the CALCULATOR!\nSend me a number:');
                });



            }
        } else if (!messageText.startsWith('/')) {
            if (num1 !== '' && operator === '') {
                bot.sendMessage(chatId, 'Please Select a operator!');
            } else if (num2 === '') {
                bot.sendMessage(chatId, 'Please Insert a Number!');

            }
        };

    }


    if (command === '/whats' && messageText === '/whats') {
        bot.sendMessage(chatId, "Sending File...", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Yes",
                            callback_data: "btn_yes"
                        },
                        {
                            text: "No",
                            callback_data: "btn_no",
                        }
                    ]
                ]
            }
        }).then((messageTextResult) => {
            bot.sendPhoto(chatId, 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg')
                .then((result) => {
                    // bot.deleteMessage(chatId, messageTextResult.message_id);
                })
                .catch((error) => {
                    console.error(error);
                    bot.sendMessage(chatId, "Error sending file: " + error.message);
                });
        });
    }


    console.log(messageText);
});

function calculat(num1, num2, operator) {
    var result = '';
    switch (operator) {
        case '÷':
            result = parseFloat(num1) / parseFloat(num2);
            break;
        case 'x':
            result = parseFloat(num1) * parseFloat(num2);

            break;

        case '+':
            result = parseFloat(num1) + parseFloat(num2);

            break;

        case '-':
            result = parseFloat(num1) - parseFloat(num2);

            break;

        default:
            break;
    }


    return `${num1} ${operator} ${num2} = ${result}`;
}

bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    let text;

    text = `You hit ${action}`;
    bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
    });
    if (command === '/start') {
        operator = action;
        bot.sendMessage(chatId, 'Send me another number:');

    }



    console.log(action);
});