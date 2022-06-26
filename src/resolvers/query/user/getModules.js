// Third Party
const {AuthenticationError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

const auth = require('../../../common/authentication')

// Type resolvers
const TModule = require('../../../types/TModule')

// Database
const knex = require('../../../db/db')

async function getModules(_, args, context, info) {
    const fields = gqlFields(info)
    // Prüft Authentifizierung
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Query alle Module aus der Datenbank
    const modules = await knex('modules')
    .select('*')
    let arrModules = []
    for (let module of modules){
        const moduleInfo = await TModule(module, fields)
        arrModules.push(moduleInfo)
    }
    // Return Daten
    return arrModules
}

module.exports = getModules