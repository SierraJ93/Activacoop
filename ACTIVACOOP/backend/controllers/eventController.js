// controlador de eventos consiste en manejar
//  las solicitudes relacionadas con los eventos,
//  como obtener la lista de eventos, crear un nuevo evento, 
// actualizar un evento existente y eliminar un evento.
//  Este controlador interactúa con la base de datos para realizar
//  estas operaciones y devuelve las respuestas correspondientes al cliente.

const database = require("../config/database");

// ==========================================
// OBTENER TODOS LOS EVENTOS
// ==========================================

const getEvents = (req, res) => {

const sql = `     SELECT
      eventos.*,
      categorias.nombre AS categoria
    FROM eventos
    LEFT JOIN categorias
      ON eventos.categoria_id = categorias.id
    ORDER BY eventos.fecha ASC
  `;

database.query(
sql,
(error, results) => {


  if (error) {

    return res.status(500).json({

      message:
        "Error al consultar los eventos"

    });

  }


  res.json(results);

}


);

};

// ==========================================
// OBTENER EVENTO POR ID
// ==========================================

const getEventById = (req, res) => {

const {
id
} = req.params;

const sql = `     SELECT
      eventos.*,
      categorias.nombre AS categoria
    FROM eventos
    LEFT JOIN categorias
      ON eventos.categoria_id = categorias.id
    WHERE eventos.id = ?
  `;

database.query(
sql,
[id],
(error, results) => {


  if (error) {

    return res.status(500).json({

      message:
        "Error al consultar el evento"

    });

  }


  if (
    results.length === 0
  ) {

    return res.status(404).json({

      message:
        "Evento no encontrado"

    });

  }


  res.json(
    results[0]
  );

}


);

};

// ==========================================
// CREAR EVENTO
// ==========================================

const createEvent = (req, res) => {

const {


titulo,
descripcion,
fecha,
hora,
lugar,
cupos_disponibles,
categoria_id


} = req.body;

// Validar campos obligatorios

if (


!titulo ||
!fecha ||
!cupos_disponibles

) {

return res.status(400).json({
  message:
    "Título, fecha y cupos son obligatorios"
  });
}

if (Number(cupos_disponibles) <= 0) {
  return res.status(400).json({
    message:
      "Los cupos deben ser mayores que cero"
  });
}

const today = new Date()
  .toISOString()
  .split("T")[0];

if (fecha < today) {
  return res.status(400).json({
    message:
      "La fecha del evento no puede ser anterior a hoy"
  });
};

const sql = `     INSERT INTO eventos
    (
      titulo,
      descripcion,
      fecha,
      hora,
      lugar,
      cupos_disponibles,
      categoria_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

database.query(


sql,

[

  titulo,
  descripcion,
  fecha,
  hora,
  lugar,
  cupos_disponibles,
  categoria_id

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
        "Error al crear el evento"

    });

  }


  res.status(201).json({

    message:
      "Evento creado correctamente",

    eventId:
      result.insertId

  });

}


);

};



// ==========================================
// ACTUALIZAR EVENTO
// ==========================================

const updateEvent = (req, res) => {

const {
id
} = req.params;

const {

titulo,
descripcion,
fecha,
hora,
lugar,
cupos_disponibles,
categoria_id


} = req.body;

const sql = `
UPDATE eventos

SET

  titulo = ?,

  descripcion = ?,

  fecha = ?,

  hora = ?,

  lugar = ?,

  cupos_disponibles = ?,

  categoria_id = ?

WHERE id = ?

`;

database.query(


sql,

[

  titulo,
  descripcion,
  fecha,
  hora,
  lugar,
  cupos_disponibles,
  categoria_id,
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
        "Error al actualizar el evento"

    });

  }


  if (
    result.affectedRows === 0
  ) {

    return res.status(404).json({

      message:
        "Evento no encontrado"

    });

  }


  res.json({

    message:
      "Evento actualizado correctamente"

  });

}


);

};

// ==========================================
// ELIMINAR EVENTO
// ==========================================

const deleteEvent = (req, res) => {

const {
id
} = req.params;

const sql = `     DELETE FROM eventos
    WHERE id = ?
  `;

database.query(


sql,

[id],

(
  error,
  result
) => {

  if (
    error
  ) {

    return res.status(500).json({

      message:
        "Error al eliminar el evento"

    });

  }


  if (
    result.affectedRows === 0
  ) {

    return res.status(404).json({

      message:
        "Evento no encontrado"

    });

  }


  res.json({

    message:
      "Evento eliminado correctamente"

  });

}


);

};

module.exports = {

getEvents,

getEventById,

createEvent,

updateEvent,

deleteEvent

};
