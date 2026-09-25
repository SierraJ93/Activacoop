const express = require("express");

const {

createRegistration,

getMyRegistrations,

cancelRegistration,

getEventParticipants,

updateAttendance

} = require(
"../controllers/registrationController"
);

const authenticateToken =
require(
"../middleware/authMiddleware"
);

const isAdmin =
require(
"../middleware/adminMiddleware"
);

const router =
express.Router();

// ==========================================
// USUARIOS
// ==========================================

// Crear inscripción

router.post(

"/",

authenticateToken,

createRegistration

);

// Mis inscripciones

router.get(

"/mis-inscripciones",

authenticateToken,

getMyRegistrations

);

// Cancelar inscripción

router.delete(

"/:id",

authenticateToken,

cancelRegistration

);

// ==========================================
// ADMINISTRADOR
// ==========================================

// Participantes de un evento

router.get(

"/evento/:eventoId/participantes",

authenticateToken,

isAdmin,

getEventParticipants

);

// Actualizar asistencia

router.put( "/:id/asistencia",

authenticateToken,

isAdmin,

updateAttendance

);

module.exports =
router;
