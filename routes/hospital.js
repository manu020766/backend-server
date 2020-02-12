const express = require('express')
const router = express.Router()

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
router.delete('/:id', (req, res) => {
    const id = req.params.id

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido borrar el hospital',
                errors: err
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        })
    })
})


module.exports = router