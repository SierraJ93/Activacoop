const database = require("../config/database");

// ==========================================
// CREAR INSCRIPCIÓN
// ==========================================

const createRegistration = async (req, res) => {
  const connection = await database.promise().getConnection();

  try {
    const userId = req.user.id;
    const { evento_id } = req.body;

    if (!evento_id) {
      connection.release();

      return res.status(400).json({
        message: "El evento es obligatorio"
      });
    }

    await connection.beginTransaction();

    const [existingRegistration] = await connection.query(
      `
      SELECT id
      FROM inscripciones
      WHERE usuario_id = ?
      AND evento_id = ?
      `,
      [userId, evento_id]
    );

    if (existingRegistration.length > 0) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        message: "Ya estás inscrito en este evento"
      });
    }

    const [events] = await connection.query(
      `
      SELECT id, cupos_disponibles
      FROM eventos
      WHERE id = ?
      FOR UPDATE
      `,
      [evento_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        message: "El evento no existe"
      });
    }

    const event = events[0];

    if (event.cupos_disponibles <= 0) {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        message: "No hay cupos disponibles"
      });
    }

    const [registrationResult] = await connection.query(
      `
      INSERT INTO inscripciones
      (usuario_id, evento_id)
      VALUES (?, ?)
      `,
      [userId, evento_id]
    );

    await connection.query(
      `
      UPDATE eventos
      SET cupos_disponibles = cupos_disponibles - 1
      WHERE id = ?
      `,
      [evento_id]
    );

    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: "Inscripción realizada correctamente",
      id: registrationResult.insertId
    });

  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error(
      "Error al crear inscripción:",
      error
    );

    return res.status(500).json({
      message: "Error interno al realizar la inscripción"
    });
  }
};


// ==========================================
// OBTENER MIS INSCRIPCIONES
// ==========================================

const getMyRegistrations = (
req,
res
) => {

const userId =
req.user.id;

const sql = `
SELECT

  inscripciones.id AS inscripcion_id,
  inscripciones.fecha_inscripcion,
  inscripciones.estado,
  eventos.id
    AS evento_id,

  eventos.titulo,

  eventos.descripcion,

  eventos.fecha,

  eventos.hora,

  eventos.lugar

FROM inscripciones

INNER JOIN eventos

  ON inscripciones.evento_id =
     eventos.id

WHERE
  inscripciones.usuario_id = ?

ORDER BY
  eventos.fecha ASC


`;

database.query(


sql,

[
  userId
],

(
  error,
  results
) => {

  if (
    error
  ) {

    return res.status(500).json({

      message:
        "Error al consultar las inscripciones"

    });

  }


  res.json(
    results
  );

}


);

};

// ==========================================
// CANCELAR INSCRIPCIÓN
// ==========================================


const cancelRegistration = async (req, res) => {
  const connection = await database.promise().getConnection();

  try {
    const userId = req.user.id;
    const registrationId = req.params.id;

    await connection.beginTransaction();

    const [registrations] = await connection.query(
      `
      SELECT id, evento_id, estado
      FROM inscripciones
      WHERE id = ?
      AND usuario_id = ?
      FOR UPDATE
      `,
      [registrationId, userId]
    );

    if (registrations.length === 0) {
      await connection.rollback();
      connection.release();

      return res.status(404).json({
        message: "Inscripción no encontrada"
      });
    }

    const registration = registrations[0];

    if (registration.estado === "cancelada") {
      await connection.rollback();
      connection.release();

      return res.status(400).json({
        message: "Esta inscripción ya fue cancelada"
      });
    }

    await connection.query(
      `
      DELETE FROM inscripciones
      WHERE id = ?
      AND usuario_id = ?
      `,
      [registrationId, userId]
    );

    await connection.query(
      `
      UPDATE eventos
      SET cupos_disponibles = cupos_disponibles + 1
      WHERE id = ?
      `,
      [registration.evento_id]
    );

    await connection.commit();
    connection.release();

    return res.json({
      message: "Inscripción cancelada correctamente"
    });

  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error(
      "Error al cancelar inscripción:",
      error
    );

    return res.status(500).json({
      message: "Error interno al cancelar la inscripción"
    });
  }
};


// ==========================================
// BUSCAR LA INSCRIPCIÓN
// ==========================================


// ==========================================
// OBTENER PARTICIPANTES DE UN EVENTO
// ==========================================

const getEventParticipants = (req,res) => {

const {eventoId} = req.params;

const sql = `

SELECT

  inscripciones.id
    AS inscripcion_id,

  usuarios.id
    AS usuario_id,

  usuarios.nombre,

  usuarios.email,

  inscripciones.fecha_inscripcion,

  inscripciones.estado,

  inscripciones.asistencia

FROM inscripciones

INNER JOIN usuarios

  ON inscripciones.usuario_id =
     usuarios.id

WHERE
  inscripciones.evento_id = ?

ORDER BY
  usuarios.nombre ASC

`;

database.query(


sql,

[
  eventoId
],

(
  error,
  results
) => {

  if (
    error
  ) {

    return res.status(500).json({

      message:
        "Error al consultar participantes"

    });

  }


  res.json(results);

}


);

};


// ==========================================
// ACTUALIZAR ASISTENCIA
// ==========================================

const updateAttendance = (
req,
res
) => {

const {id} = req.params;

const {
asistencia
} = req.body;

const validStatuses = [


"pendiente",

"asistio",

"no_asistio"


];

if (
!validStatuses.includes(
asistencia
)
) {


return res.status(400).json({

  message:
    "Estado de asistencia inválido"

});


}

const sql = `


UPDATE inscripciones

SET asistencia = ?

WHERE id = ?


`;

database.query(


sql,

[
  asistencia,
  id
],

(
  error,
  result
) => {

  if (
    error
  ) {

    return res.status(500).json({

      message:
        "Error al actualizar asistencia"

    });

  }


  if (
    result.affectedRows === 0
  ) {

    return res.status(404).json({

      message:
        "Inscripción no encontrada"
    });

  }


  res.json({

    message:
      "Asistencia actualizada correctamente"

  });

}

);
};


module.exports = {
  createRegistration,
  getMyRegistrations,
  cancelRegistration,
  getEventParticipants,
  updateAttendance
};


