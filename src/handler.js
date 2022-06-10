const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updateAt = createAt;
    const newNote = {
        id, title, body, tags, createAt, updateAt
    };
    
    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id == id).length > 0;


    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catata berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        
        response.code(201);
        response.header("Access-Control-Allow-Private-Network: true");
        return response;
    } 

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
})

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const note = notes.filter((item) => item.id === id)[0];
    
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler= (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updateAt = new Date().toISOString();
    const index = notes.findIndex((item) => item.id === id);
    
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbaharui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gaggal memperbaharui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((item) => item.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapu',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};


module.exports = { 
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler, 
    editNoteByIdHandler,
    deleteNoteByIdHandler, };