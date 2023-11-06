const mongoose = require('mongoose')

/** Database configuration 
 * no matter where you are with this link below you are
 * you can insert the data into mongo db documents;
 * to check these, simply download mongo compass and connect with the link
 */

const connectDB = async () =>{
try {
    mongoose.connect("mongodb+srv://Administrator:Gagzn7gluhsA4Asm@cluster0.inv20lm.mongodb.net/", {
    useUnifiedTopology:true
}) .then(() =>{
    console.log("connected to database");
})
} catch (error) {
    console.log(error);
    process.exit();
}
}

module.exports = connectDB;
