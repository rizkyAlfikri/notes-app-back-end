require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationValidator = require('./validator/collaborations');
const TokenManager = require('./tokenize/TokenManager');

// exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const collaborationsService = new CollaborationsService();
    const noteService = new NotesService(collaborationsService);
    const usersService = new UserService();
    const authenticationsService = new AuthenticationsService();


    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    server.auth.strategy('notesapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            }
        }),
    });

    await server.register([
        {
            plugin: notes,
            options: {
                service: noteService,
                validator: NotesValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UserValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                notesService: noteService,
                validator: CollaborationValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                validator: ExportsValidator,
            },
        },
    ]);

    console.log(ExportsValidator);

    await server.start();
    console.log(`Sever berjalan pada ${server.info.uri}`);

};

init();