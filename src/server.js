require('dotenv').config();
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

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

    const noteService = new NotesService();

    await server.register({
        plugin: notes,
        options: {
            service: noteService,
            validator: NotesValidator,
        },
    });

    // server.route(routes);

    // registrasi single plugin
    // await server.register({
    //     plugin: notesPlugin,
    //     options: { notes: [] },
    // });

    // registrasi multiple plugin
    // await server.register([{
    //     plugin: notesPlugin,
    //     options: { notes: [] },
    // },
    // {
    //     plugin: otherPlugin,
    //     options: { otherOptions },
    // },
    // ]);

    await server.start();
    console.log(`Sever berjalan pada ${server.info.uri}`);

};

init();