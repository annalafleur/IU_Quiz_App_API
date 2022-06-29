const knex = require('../db/db')

async function TUser(user, fields){
    // Build return object
    const userInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return user.uuid
            } else {
                return null
            }
        })(),
        first_name: await ( async () => {
            if ('first_name' in fields){
                return user.first_name
            } else {
                return null
            }
        })(),
        last_name: await ( async () => {
            if ('last_name' in fields){
                return user.last_name
            } else {
                return null
            }
        })(),
        avatar_url: await ( async () => {
            if ('avatar_url' in fields){
                return user.avatar_url
            } else {
                return null
            }
        })(),
        degree: await ( async () => {
            if ('degree' in fields){
                return user.degree
            } else {
                return null
            }
        })(),
        study_start: await ( async () => {
            if ('study_start' in fields){
                return user.study_start
            } else {
                return null
            }
        })()
    }
    // Return requested data
    return userInfo
}

module.exports = TUser