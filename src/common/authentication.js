// Database
const knex = require('../db/db')

async function authenticationResult(success, message) {
    return {
        success,
        message
    }
}

async function authorizeUser(user) {
    // Check passed user
    if (!user) {
        return await authenticationResult(false, 'You are not authenticated')
    }
    // Check if account is banned
    if (user.is_banned) {
        return await authenticationResult(false, 'This account has been banned')
    }
    // Check if user is verified
    if (!user.is_verified){
        return await authenticationResult(false, 'Please verify your email address')
    }
    // Authentication as user was successfull
    return await authenticationResult(true, 'Authenticated')
}

async function authorizeSuperadmin(user) {
    // Check if parameters are given
    if (!user){
        return await authenticationResult(false, 'Something went wrong')
    }
    // Check normal user authentication first
    const userAuthResult = await authorizeUser(user)
    if (!userAuthResult.success) {
        return userAuthResult
    }
    // Check if user is superadmin
    if (!user.is_admin) {
        return await authenticationResult(false, 'Permission denied')
    }
    // Authentication as superadmin was successfull
    return await authenticationResult(true, 'Authenticated')
}

module.exports = {
    authorizeUser,
    authorizeSuperadmin
}






/*
    User B: sucht für User A seine Id raus
    User A: Freund hinzufügen mit id #lkjgf
    User B: bekommt Freundesanfrage von User A und kann diese
    annehmen bzw. entfernen



    // addFriendById()
    // Existiert zieluser mit id?
        -> nein: Error
    //Ist Sender Zieluser
        -> ja: Error
    // Sender und Zieluser schon befreundet?
        -> ja: Error
    //Existiert bereits Anfrage von Sender an Zieluser
        -> ja: Error
    //Existiert Anfrage von Zieluser an Sender
        -> ja: lösche Anfrage von Zieluser and Sender
                und Erstelle Eintrag in Freundestabelle
    Erstee Eintrag in Pending-Tabelle     



*/