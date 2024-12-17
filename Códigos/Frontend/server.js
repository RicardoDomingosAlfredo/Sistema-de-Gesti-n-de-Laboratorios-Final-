const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Laboratorio')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error(err));

// Modelos MongoDB
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

const Item = mongoose.model('Item', ItemSchema);
const Reserva = mongoose.model('Reserva', ReservaSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas para Items (Laboratorios)
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

app.post('/reservas', async (req, res) => {
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

// Ruta para crear un usuario (POST)
app.post('/usuarios', async (req, res) => {
    try {
        const newUser = new Usuario(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Ruta para eliminar un usuario por nombre (DELETE)
app.delete('/usuarios/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;
        const usuarioEliminado = await Usuario.findOneAndDelete({ nombre: nombre });

        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado', usuario: usuarioEliminado });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
