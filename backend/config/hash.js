const bcrypt = require('bcryptjs')
// la fonction est utilisé pour la création de l'utilisateur enfin de cripter le mote de passe
async function hashedPassword(password){
    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword;
}

module.exports = {hashedPassword}