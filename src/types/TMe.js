const knex = require('../db/db')

async function TMe(user, fields){
    // Build return object
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
                .orderBy('id', 'ASC')
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
        stats: await ( async () => {
            if ('stats' in fields){
                // Define stats object
                let stats = {
                    total_games: 0,
                    total_questions: 0,
                    wins_percentage: null,
                    correct_answers_percentage: null
                }
                // Calculate stats
                const complete_games = await knex('games')
                .select('*')
                .where(function(){
                    this.where({
                        user_sent_by: user.id
                    })
                    this.orWhere({
                        user_sent_to: user.id
                    })
                })
                .andWhere({
                    is_game_over: true
                })
                .orderBy('id', 'ASC')
                if (complete_games.length > 0){
                    const total_games = complete_games.length
                    let won_games = 0
                    let total_questions = 0
                    let right_answers = 0
                    for (let complete_game of complete_games){
                        let is_user_a = true
                        if (complete_game.user_sent_by != user.id){
                            is_user_a = false
                        }
                        // Check if user won this game
                        if (complete_game.winner == user.id){
                            won_games++
                        }
                        // Check for correct answers
                        let game_questions_where = {
                            game: complete_game.id,
                        }
                        if (is_user_a){
                            game_questions_where.is_played_by_user_a = true
                        } else {
                            game_questions_where.is_played_by_user_b = true
                        }
                        const game_questions = await knex('game_questions')
                        .select('*')
                        .where(game_questions_where)
                        for (let game_question of game_questions){
                            const question = await knex('questions')
                            .select('*')
                            .where({
                                id: game_question.question
                            })
                            .first()
                            if (!question){
                                continue
                            }
                            total_questions++
                            if (is_user_a){
                                if (game_question.user_a_answer == question.correct_answer){
                                    right_answers++
                                }
                            } else {
                                if (game_question.user_b_answer == question.correct_answer){
                                    right_answers++
                                }
                            }
                        }
                    }
                    stats.total_games = total_games
                    stats.total_questions = total_questions
                    stats.wins_percentage = ((100 / total_games) * won_games)
                    stats.correct_answers_percentage = ((100 / total_questions) * right_answers)
                }
                return stats
            } else {
                return null
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
    // Return requested data
    return meInfo
}

module.exports = TMe