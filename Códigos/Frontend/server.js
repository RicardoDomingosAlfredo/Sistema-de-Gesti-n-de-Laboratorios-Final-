const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const csrf = require('csurf');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Protección CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Laboratorio')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Modelos MongoDB (Materiales del Laboratorio)
const ItemSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
    estado: String,
});

const ReservaSchema = new mongoose.Schema({
    equipo: String,
    fecha: String,
    horaInicio: String,
    horaFin: String,
});

const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String,
});

UsuarioSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10); // Genera un salt
        this.password = await bcrypt.hash(this.password, salt); // Hashea la contraseña
    }
    next();
});

const Item = mongoose.model('Item', ItemSchema);
const Reserva = mongoose.model('Reserva', ReservaSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas para Items/Materiales
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los items' });
    }
});

app.post('/items', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el item' });
    }
});

app.delete('/items/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const itemEliminado = await Item.findOneAndDelete({ nombre: nombre });

        if (!itemEliminado) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        res.json({ message: 'Item eliminado', item: itemEliminado });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el item', error: err.message });
    }
});

// Rutas para Reservas
app.get('/reservas', async (req, res) => {
    try {
        const reservas = await Reserva.find();
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
});

app.post('/reservas', csrfProtection, async (req, res) => {
    try {
        const nuevaReserva = new Reserva(req.body);
        await nuevaReserva.save();
        res.json(nuevaReserva);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear la reserva' });
    }
});

app.delete('/reservas/:id', async (req, res) => {
    try {
        await Reserva.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reserva eliminada' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar la reserva' });
    }
});

// Rutas para Usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// Ruta para crear un usuario
app.post('/usuarios', [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newUser = new Usuario(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Ruta para login (Generación de JWT)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        // Generar un token JWT
        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    } else {
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }
});

// Middleware de autenticación con JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        req.userId = decoded.userId; // Agregar el userId al objeto de la solicitud
        next();
    });
};

// Ruta protegida de ejemplo
app.get('/items/protegidos', verifyToken, async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los items protegidos' });
    }
});

// Configuración de HTTPS (si tienes los archivos de certificado)
const useHttps = false; // Cambia esto a `true` si tienes los certificados SSL

if (useHttps) {
    const options = {
        key: fs.readFileSync(path.join(__dirname, 'private-key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'certificate.pem'))
    };

    https.createServer(options, app).listen(PORT, () => {
        console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
    });
} else {
    // Si no usas HTTPS, usa HTTP
    app.listen(PORT, () => {
        console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
    });
}
