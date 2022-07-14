module.exports = {
    name: 'notes',
    version: '1.0.0',
    register: async (server, options) => {
        const notes = options.notes;
        server([
            {
                method: 'GET',
                path: '/notes',
                handler: () => {
                    return notes;
                }
            },
        ])
    },
}