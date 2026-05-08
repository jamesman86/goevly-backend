const express = require('express')
const router = express.Router()
const { registro, login } = require('../controllers/auth.controller')
const { verificarToken } = require('../middlewares/auth.middleware')

// Rutas públicas
router.post('/registro', registro)
router.post('/login', login)

// Ruta protegida — solo con token válido
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Perfil del usuario',
    user: req.user
  })
})

module.exports = router