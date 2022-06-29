// Third Party
const {AuthenticationError, UserInputError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Database
const knex = require('../../../db/db')

// Type resolvers
const TGame = require('../../../types/TGame')

async function getGameById(_, {game_uuid}, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Find target game
    const targetGame = await knex('games')
    .select('*')
    .where({
        uuid: game_uuid
    })
    .andWhere(function(){
        this.where({
            user_sent_by: context.user.id
        })
        this.orWhere({
            user_sent_to: context.user.id
        })
    })
    .andWhere({
        is_game_over: false
    })
    .first()
    if (!targetGame){
        throw new UserInputError('Game was not found')
    }
    // Return information
    return await TGame(targetGame, fields)
}

module.exports = getGameById