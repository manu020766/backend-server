const { Router } = require('express')

const Medico = require('../models/medico')
const router = Router()

router.get('/', (req, res) => {
    Medico.find({})
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok:false,
                    mensaje: 'No se han podido recuperar los médicos',
                    erros: err
                })
            }

            res.status(200).json({
                ok: true,
                medicos
            })
        })
})

module.exports = router
