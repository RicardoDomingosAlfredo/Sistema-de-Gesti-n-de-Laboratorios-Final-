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

// Modelo MongoDB para Items
const ItemSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
    estado: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Modelo MongoDB para Reservas
const ReservaSchema = new mongoose.Schema({
    equipo: String,
    fecha: String,
    horaInicio: String,
    horaFin: String,
});

const Reserva = mongoose.model('Reserva', ReservaSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  

// Rutas para Items
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

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:5000`));
