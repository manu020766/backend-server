const express = require('express')
const router = express.Router()

// Rutas
router.get('/', (req, res) => {
    res.status(200).json({ mensaje: 'Hola mundillo!!! ¿ Que hay de nuevo ?' })
})

module.exports = router