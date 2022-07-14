const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');
const NotesValidator = require('./validator/notes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
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