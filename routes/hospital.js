const express = require('express')
const router = express.Router()

const { verificaToken } = require('../middlewares/autentication')
const Hospital = require('../models/hospital')

router.get('/', (req, res) => {
    Hospital.find({})
    .exec(
        (err, hospitales) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'No se han podido recuperar los hospitales'
                })
            }
            
            res.status(200).json({
                hospitales
            })
        })
})

//----------------------------------------
//--- Borrar un hospital------------------
//----------------------------------------
router.delete('/:id', verificaToken, (req, res) => {
    const id = req.params.id

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido borrar el hospital',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado,
            usuarioToken: req.usuario
        })
    })
})

//----------------------------------------
//--- Crear un hospital-------------------
//----------------------------------------
router.post('/', verificaToken, (req, res) => {
    const body = req.body

    // console.log('Usuario Token: ',req.usuario._id)

    const hospital = new Hospital({
        nombre: body.nombre,
        image: null,
        usuario: req.usuario._id
    })
    hospital.save((err, hospitalGuardardo) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido grabar el hospital',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalGuardardo,
            usuarioToken: req.usuario
        })
    })
})

//----------------------------------------
//--- Modificar un hospital---------------
//----------------------------------------
router.put('/:id', verificaToken, (req, res)=> {
    const id = req.params.id
    const body = req.body

    Hospital.findById(id, (err, hospital)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido encontrar el hospital',
                errors: err
            })
        }

        if (!hospital) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se ha podido encontrar el hospital',
                errors: err
            })
        }

        hospital.nombre = body.nombre
        hospital.usuario = req.usuario._id

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hospital',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                usuarioToken: req.usuario
            })
        })
    })
})

module.exports = router