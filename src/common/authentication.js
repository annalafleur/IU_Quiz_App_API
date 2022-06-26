// Datenbank
const knex = require('../db/db')

async function authenticationResult(success, message) {
    return {
        success,
        message
    }
}

async function authorizeUser(user) {
    if (!user) {
        return await authenticationResult(false, 'You are not authenticated')
    }
    return await authenticationResult(true, 'Authenticated')
}


module.exports = {
    authorizeUser
}
