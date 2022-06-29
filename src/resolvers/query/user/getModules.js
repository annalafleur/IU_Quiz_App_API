// Third Party
const {AuthenticationError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Type resolvers
const TModule = require('../../../types/TModule')

// Database
const knex = require('../../../db/db')

async function getModules(_, args, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Query all modules from database
    const modules = await knex('modules')
    .select('*')
    .orderBy('id', 'ASC')
    // Gather array of modules
    let arrModules = []
    for (let module of modules){
        const moduleInfo = await TModule(module, fields)
        arrModules.push(moduleInfo)
    }
    // Return requested data
    return arrModules
}

module.exports = getModules