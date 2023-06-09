//the allowed origins of the project

const allowedOrigins = [
    'http://127.0.0.1:3000',
    'http://localhost:3000'
];

const corsOptions = {

    origin: (origin, callback) => {

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {

            callback(null, true)

        } 

        else {

            callback(new Error('Not allowed by CORS'));
        }
    },

    optionSuccessStatus: 200
}

module.exports = corsOptions