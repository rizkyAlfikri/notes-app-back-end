const { payload } = require("@hapi/hapi/lib/validation");
const ClientError = require("../../exceptions/ClientError");

class CollaborationsHanlder {

    constructor(collaborationService, noteService, validator) {
        this._collaborationService = collaborationService;
        this._noteService = noteService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId  } = request.auth.credentials ;
            const { noteId, userId } = request.payload;

            await this._noteService.verifyNoteOwner(noteId, credentialId );

            const collaborationId = await this._collaborationService.addCollaboration(noteId, userId);
            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
                },
            });

            response.code(201);
            return response;

        } catch(error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);
                return response;
            }

            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }

    
    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id : credentialId } = request.auth.credentials;
            const { noteId, userId} = request.payload;

            await this._noteService.verifyNoteOwner(noteId, credentialId);
            await this._collaborationService.deleteCollaboration(noteId, userId);

            return {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            };
            
        } catch(error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });

                response.code(error.statusCode);
                return response;
            }

            // Server Error
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });

            response.code(500);
            console.error(error);
            return response;
        }
    }

   
}

module.exports = CollaborationsHanlder