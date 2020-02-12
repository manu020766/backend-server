const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    image: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' })

module.exports = mongoose.model('Hospital', HospitalSchema)


