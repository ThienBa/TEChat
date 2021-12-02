const dateFormat = require('date-format');

const createMessages = (messageText, avatar) => {
    return {
        messageText,
        avatar,
        createdAt: dateFormat("dd/MM/yyyy - hh:mm:ss", new Date()),
    }
}

module.exports = {
    createMessages,
}