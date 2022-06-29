// Third Party
const {AuthenticationError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

// Type resolvers
const TGame = require('../../../types/TGame')

async function getMyOngoingGames(_, args, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Get all ongoing games
    const games = await knex('games')
    .select('*')
    .where(function(){
        this.where({
            user_sent_by: context.user.id,
        })
        this.orWhere({
            user_sent_to: context.user.id,
        })
    })
    .andWhere({
        is_game_over: false
    })
    .orderBy('id', 'ASC')
    let arrGames = []
    for (let game of games){
        const gameData = await TGame(game, fields)
        arrGames.push(gameData)
    }
    // Return requested data
    return arrGames
}

module.exports = getMyOngoingGames