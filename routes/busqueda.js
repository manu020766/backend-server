const router = require('express').Router()

const Hospital = require('../models/hospital')
const Medico = require('../models/medico')
const Usuario = require('../models/usuario')

router.get('/todo/:busqueda', (req, res)=> {
    const busqueda = req.params.busqueda
    const regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(regex),
        buscarMedicos(regex),
        buscarUsuarios(regex)
    ])
    .then(resultado => {
        res.status(200).json({
            ok:true,
            hospitales: resultado[0],
            medicos: resultado[1],
            usuarios: resultado[2]
        })
    })
    .catch( error => res.status(500).json({ok:false, mensaje: error}))

    // buscarHospitales(regex)
    //     .then(hospitales => res.status(200).json({ ok: true, hospitales}))
    //     .catch( error => res.status(500).json({ok:false, mensaje: error}))

    // buscarMedicos(regex)
    //     .then(medicos => res.status(200).json({ ok: true, medicos}))
    //     .catch( error => res.status(500).json({ok:false, mensaje: error}))

    // buscarUsuarios(regex)
    //     .then(usuarios => res.status(200).json({ ok: true, usuarios}))
    //     .catch( error => res.status(500).json({ok:false, mensaje: error}))

})

function buscarHospitales(regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ "nombre": regex }, (err, hospitales) => {
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
        Usuario.find({ "nombre": regex }, (err, usuarios) => {
            if (err) reject("No se ha podido realizar la consulta de usuarios")
            resolve(usuarios)
        })
    })
}

module.exports = router