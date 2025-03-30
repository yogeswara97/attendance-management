const collections = {
    development: {
        divisions: 'DevDivisions',
        logbooks: 'DevLogbooks',
        users: 'DevUsers',
    },
    production: {
        divisions: 'Divisions',
        logbooks: 'Logbooks',
        users: 'Users',
    },
};

const environment = import.meta.env.VITE_APP_ENV === 'production' ? 'production' : 'development';

export const collectionNames = collections[environment];