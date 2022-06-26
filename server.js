// Third party
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { execute, subscribe} = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { createServer } = require('http')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const depthLimit = require('graphql-depth-limit')
require('dotenv').config()

// Database
const knex = require('./src/db/db')

// Schema + Resolvers
const resolvers = require('./src/graphql/resolvers')
const schema = require('./src/graphql/schema')

// Defaut async iterator
const pubsub = new PubSub()

// Create executable schema
const execSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers
})
// Setup Server
const app = express()
const httpServer = createServer(app)
// Define Subscription Server
const subscriptionServer = SubscriptionServer.create(
    {
        schema: execSchema,
        execute,
        subscribe,
        onConnect(connectionParams, webSocket, context){
            console.log('Connected')
            return {
                pubsub: pubsub
            }
        },
        onDisconnect(webSocket, context){
            console.log('Disconnected')
        }
    },
    {
        server: httpServer,
        path: '/graphql'
    }
)
// Define Server Properties
const server = new ApolloServer({
    cors: {
        origin: '*',
        credentials: true,
    },
    typeDefs: schema,
    resolvers,
    plugins: [
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close()
                    }
                }
            }
        }
    ],
    debug: false,
    validationRules: [
        depthLimit(10)
    ],
    context: async ({ req }) => {
        const token = req.headers.authorization || ''
        const remoteAddress = req.ip
        if (token) {
            try {
                // Try verifying user by json web token
                const tokenData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
                // Find user associated to json web token
                const tokenUser = await knex('users')
                .select('*')
                .where({
                    id: tokenData.id,
                    email: tokenData.email
                }).first()
                // Pass info to resolver
                return {
                    pubsub: pubsub,
                    user: tokenUser,
                    ip: remoteAddress
                }
            } catch (err) {
                return {
                    pubsub: pubsub,
                    ip: remoteAddress
                }
            }
        } else {
            // Show console message if dev environment when no token provided
            if (process.env.NODE_ENV == 'development'){
            }
            return {
                pubsub: pubsub,
                ip: remoteAddress
            }
        }
    }
})
app.enable('trust proxy')
app.use(cors())
server.start()
server.applyMiddleware({ app })

// Start Server
httpServer.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at localhost:${process.env.PORT}${server.graphqlPath}`)
)
