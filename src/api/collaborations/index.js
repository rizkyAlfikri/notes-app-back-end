const { server } = require("@hapi/hapi");
const CollaborationsHanlder = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { collaborationsService, notesService, validator}) => {
        const collaborationsHandler = new CollaborationsHanlder(
            collaborationsService, notesService, validator
        );

        server.route(routes(collaborationsHandler));
    },
}