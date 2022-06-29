// Third Party
const {AuthenticationError} = require('apollo-server-express')
const gqlFields = require('graphql-fields')

// Common
const auth = require('../../../common/authentication')

// Type resolvers
const TMe = require('../../../types/TMe')

async function getMyProfile(_, args, context, info) {
    const fields = gqlFields(info)
    // Check authentication
    const authResult = await auth.authorizeUser(context.user)
    if (!authResult.success){
        throw new AuthenticationError(authResult.message)
    }
    // Return requested data
    return await TMe(context.user, fields)
}

module.exports = getMyProfile