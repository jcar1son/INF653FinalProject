const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//grabs the state code and then inputs the funfact
const statesFunFactsSchema = new Schema({

    stateCode: {

        type: String,
        required: true,
        unique: true

    },

    funfacts: [{

        type: String

    }]

});

//exports the funfact
module.exports = mongoose.model('states', statesFunFactsSchema);