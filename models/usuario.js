const mongoose = require('mongoose')

const schema = mongoose.Schema

const usuarioSchema = new schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, unique: true, required: [true, 'El email debe ser único'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true,  default: 'USER_ROLE'},
})
//Por defecto el nombre: usuario en plural hace referencia a la collection de mongo en plural: usuarios
//Por eso cuango algo el find, no necesito poner el nombre de la collection ya que lo que hace es:
//cojer el nombre del modelo y ponerlo en plural
module.exports = mongoose.model('usuario', usuarioSchema) 