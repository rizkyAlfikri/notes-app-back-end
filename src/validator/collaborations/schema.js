const Joi = require('joi');

const CollaborationPayloadScheme = Joi.object({
    noteId: Joi.string().required(),
    userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadScheme };