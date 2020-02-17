const router = require('express').Router()

const Hospital = require('../models/hospital')
const Medico = require('../models/medico')
const Usuario = require('../models/usuario')

router.get('/todo/:tipo/:busqueda', (req, res) => {
    const tipo = req.params.tipo
    const busqueda = req.params.busqueda
    const regex = new RegExp(busqueda, 'i')

    let promise
    switch (tipo) {
        case 'hospital':
            promise = buscarHospitales(regex)
            break
        case 'medico':
            promise = buscarMedicos(regex)
            break
        case 'usuario':
            promise = buscarUsuarios(regex)
            break
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'La información que solicitas no existe'
            })
    }

    promise
        .then(datos => { res.status(200).json({ ok: true, [tipo]: datos }) })
        .catch(error => res.status(500).json({ ok: false, mensaje: error }))

})

router.get('/todo/:busqueda', (req, res) => {
    const busqueda = req.params.busqueda
    const regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ])
        .then(resultado => {
            res.status(200).json({
                ok: true,
                hospitales: resultado[0],
                medicos: resultado[1],
                usuarios: resultado[2]
            })
        })
        .catch(error => res.status(500).json({ ok: false, mensaje: error }))
})

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ "nombre": regex })
            .populate("usuario", 'nombre email')   // Aquí se pone el campo del modelo hospital: usuario
            .exec((err, hospitales) => {
                if (err) reject("No se ha podido realizar la consulta de hospitales")
                resolve(hospitales)
            })
    })
}

function buscarMedicos(regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ "nombre": regex }, (err, medicos) => {
            if (err) reject("No se ha podido realizar la consulta de médicos")
            resolve(medicos)
        })
    })
}

function buscarUsuarios(regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) reject('Error al cargar usuario', err)
                resolve(usuarios)
            })
    })
}

module.exports = router