const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Registro de turista o propietario
const registro = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body

  try {
    // Verificar si el email ya existe
    const [existing] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?', [email]
    )
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Guardar en base de datos
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre_completo, email, telefono, password, rol) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, phone || '', hashedPassword, role || 'turista']
    )

    // Generar token
    const token = jwt.sign(
      { id: result.insertId, email, role: role || 'turista' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: '¡Registro exitoso!',
      token,
      user: {
        id: result.insertId,
        fullName,
        email,
        role: role || 'turista'
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al registrar usuario' })
  }
}

// Login
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Buscar usuario
    const [users] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    const user = users[0]

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: `¡Bienvenido, ${user.nombre_completo.split(' ')[0]}!`,
      token,
      user: {
        id: user.id,
        fullName: user.nombre_completo,
        email: user.email,
        role: user.rol
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al iniciar sesión' })
  }
}

module.exports = { registro, login }