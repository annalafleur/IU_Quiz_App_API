const knex = require('../db/db')

async function TMe(user, fields){
   
    const meInfo = {
        uuid: await ( async () => {
            if ('uuid' in fields){
                return user.uuid
            } else {
                return null
            }
        })(),
        email: await ( async () => {
            if ('email' in fields){
                return user.email
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
        })(),
        friends: await ( async () => {
            if ('friends' in fields){
                const TUser = require('./TUser')
                const myFriendships = await knex('friendships')
                .select('*')
                .where({
                    user_sent_by: user.id
                })
                .orWhere({
                    user_sent_to: user.id
                })
                let myFriendsArr = []
                for (let myFriend of myFriendships){
                    let targetFriendId
                    if (myFriend.user_sent_by == user.id){
                        targetFriendId = myFriend.user_sent_to
                    } else {
                        targetFriendId = myFriend.user_sent_by
                    }
                    const targetFriend = await knex('users')
                    .select('*')
                    .where({
                        id: targetFriendId
                    })
                    .first()
                    if (!targetFriend){
                        continue
                    }
                    const myFriendInfo = await TUser(targetFriend, fields.friends)
                    myFriendsArr.push(myFriendInfo)
                }
                return myFriendsArr
            } else {
                return []
            }
        })(),
        created_at: await ( async () => {
            if ('created_at' in fields){
                return user.created_at
            } else {
                return null
            }
        })()
    }
    // Return Daten
    return meInfo
}

module.exports = TMe