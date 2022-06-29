// Third Party
const {AuthenticationError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

// Type resolvers
const TCompleteGame = require('../../../types/TCompleteGame')

async function getPastGames(_, args, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Find my past games
    const myPastGames = await knex('games')
    .select('*')
    .where(function(){
        this.where({
            user_sent_by: context.user.id
        })
        this.orWhere({
            user_sent_to: context.user.id
        })
    })
    .andWhere({
        is_game_over: true
    })
    .orderBy('id', 'ASC')
    let arrMyPastGames = []
    for (let myPastGame of myPastGames){
        const myPastGameData = TCompleteGame(myPastGame, fields)
        arrMyPastGames.push(myPastGameData)
    }
    // Return information
    return arrMyPastGames
}

module.exports = getPastGames