const InvariantError = require("../../exceptions/InvariantError");
const { CollaborationPayloadScheme } = require("./schema")

const CollaborationValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationPayloadScheme.validate(payload);
  
        if(validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    }
}

module.exports = CollaborationValidator;