const express = require('express')
const router = express.Router()

const Usuario = require('../models/usuario')

// Rutas
router.get('/', (req, res) => {

    Usuario.find({},'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'No se pueden recuperar los usuarios',
                        errors: err
                    })
                }
                
                res.status(200).json({
                    ok: true,
                    usuarios
                    })
            }
        )
})

module.exports = router