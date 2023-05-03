const mongoose = require('mongoose');
const errorHandler = require('../middleware/errorHandler');

//connects the the db
const connectDB = async () => {
    
    try {

        await mongoose.connect("mongodb+srv://devastator321x:QdrmlUKVWgq4GO0J@cluster0.kspjhii.mongodb.net/?retryWrites=true&w=majority", {

            useUnifiedTopology: true,
            useNewUrlParser: true

        });

    } 
    
    catch (err) {

        errorHandler(err);

    }
}

module.exports = connectDB;