const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const reservationForm = document.getElementById("reservation-form");
const roomForm = document.getElementById("room-form");
const availabilityForm = document.getElementById("availability-form");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const regUsernameInput = document.getElementById("reg-username");
const regPasswordInput = document.getElementById("reg-password");
const roomInput = document.getElementById("room");
const dateInput = document.getElementById("date");
const availabilityDateInput = document.getElementById("availability-date");

const roomList = document.getElementById("room-list");
const reservationList = document.getElementById("reservation-list");
const availableRoomsList = document.getElementById("available-rooms-list");

const users = JSON.parse(localStorage.getItem("users")) || [];
const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
const rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// Mostrar una pantalla
function showScreen(screenId) {
    document.querySelectorAll(".container").forEach((screen) => {
        screen.classList.add("hidden");
    });
    document.getElementById(screenId).classList.remove("hidden");
}

// Inicio de sesión
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        alert(`Bienvenido, ${username}`);
        showScreen("management-screen");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
});

// Registro de usuario
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = regUsernameInput.value.trim();
    const password = regPasswordInput.value.trim();

    if (users.some((u) => u.username === username)) {
        alert("El usuario ya existe.");
    } else {
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Usuario registrado exitosamente.");
        showScreen("login-screen");
    }
});

// Registrar una nueva sala
roomForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const roomName = document.getElementById("room-name").value.trim();
    const roomMaterials = document.getElementById("room-materials").value.trim();

    if (rooms.some((r) => r.name === roomName)) {
        alert("El sala ya está registrada.");
        return;
    }

    rooms.push({ name: roomName, materials: roomMaterials });
    localStorage.setItem("rooms", JSON.stringify(rooms));
    updateRoomList();
    updateRoomSelect();
    alert(`Sala"${roomName}" registrada con materiales: ${roomMaterials}.`);
});

// Actualizar la lista de Salas
function updateRoomList() {
    roomList.innerHTML = rooms
        .map((room) => `<li>${room.name} - Materiales: ${room.materials}</li>`)
        .join("");
}

// Actualizar el menú desplegable de Salas
function updateRoomSelect() {
    roomInput.innerHTML = rooms
        .map((room) => `<option value="${room.name}">${room.name}</option>`)
        .join("");
}

// Añadir reserva
reservationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const room = roomInput.value;
    const date = dateInput.value;

    reservations.push({ room, date });
    localStorage.setItem("reservations", JSON.stringify(reservations));
    updateReservationList();
    alert(`Reserva añadida para el aula "${room}" el ${date}.`);
});

// Actualizar lista de reservas
function updateReservationList() {
    reservationList.innerHTML = reservations
        .map((res, index) => `
        <li>
            ${res.room} - ${res.date}
            <button onclick="deleteReservation(${index})">Eliminar</button>
        </li>`)
        .join("");
}

// Eliminar reserva
function deleteReservation(index) {
    reservations.splice(index, 1);
    localStorage.setItem("reservations", JSON.stringify(reservations));
    updateReservationList();
}

// Consultar disponibilidad de Salas
availabilityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = availabilityDateInput.value;

    const reservedRooms = reservations.filter((res) => res.date === date).map((res) => res.room);
    const availableRooms = rooms.filter((room) => !reservedRooms.includes(room.name));

    availableRoomsList.innerHTML = availableRooms
        .map((room) => `<li>${room.name} - Materiales: ${room.materials}</li>`)
        .join("");
});

// Cerrar sesión
document.getElementById("logout-btn").addEventListener("click", () => {
    showScreen("login-screen");
});

// Inicializar
updateRoomList();
updateRoomSelect();
updateReservationList();
