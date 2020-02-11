const mongoose = require('mongoose')

const schema = mongoose.Schema

const usuarioSchema = new schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email es único'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true,  default: 'USER_ROLE'},
})

module.exports = mongoose.model('usuario', usuarioSchema)