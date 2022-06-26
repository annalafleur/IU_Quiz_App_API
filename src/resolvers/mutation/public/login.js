// Third Party
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const gqlFields = require('graphql-fields')

const res = require('../../../common/response')
const auth = require('../../../common/authentication')

// Type resolvers
const TMe = require('../../../types/TMe')

const knex = require('../../../db/db')

async function login(_, { email, password }, context, info) {
    const fields = gqlFields(info)
    const userEmail = email.toLowerCase()
    const user = await knex('users')
    .select('*')
    .where({
        email: userEmail
    })
    .first()
    // Prüft, ob User mit bestimmter Email existiert
    if (!user) {
        return res.fail({
            message: 'No user with that email address',
            data: {
                email: userEmail
            }
        })
    }
    // Prüft, ob Passwort korrekt ist
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
        return res.fail({
            message: 'Invalid password'
        })
    }
    // Prüft die Authentifizierung 
    const authResult = await auth.authorizeUser(user)
    if (!authResult.success) {
        return res.fail({
            message: authResult.message
        })
    }
    // Return Daten
    return res.success(
        {
            message: 'Login successful'
        },
        {
            jwt: jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    st: user.securityToken
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '7d'
                }
            ),
            me: await ( async () => {
                if ('me' in fields){
                    return await TMe(user, fields.me)
                } else {
                    return null
                }
            })()
        }
    )
}

module.exports = login