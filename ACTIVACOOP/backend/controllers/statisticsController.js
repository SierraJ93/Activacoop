//====================================
//    Controlador de estadisticas
//====================================

const database = require("../config/database");

const getStatistics = (req, res) => {
  const queries = {
    events: `
      SELECT COUNT(*) AS total
      FROM eventos
    `,

    categories: `
      SELECT COUNT(*) AS total
      FROM categorias
    `,

    registrations: `
      SELECT COUNT(*) AS total
      FROM inscripciones
      WHERE estado = 'confirmada'
    `,

    attended: `
      SELECT COUNT(*) AS total
      FROM inscripciones
      WHERE asistencia = 'asistio'
    `
  };

  database.query(queries.events, (errorEvents, eventsResult) => {
    if (errorEvents) {
      return res.status(500).json({
        message: "Error al consultar los eventos"
      });
    }

    database.query(
      queries.categories,
      (errorCategories, categoriesResult) => {
        if (errorCategories) {
          return res.status(500).json({
            message: "Error al consultar las categorías"
          });
        }

        database.query(
          queries.registrations,
          (errorRegistrations, registrationsResult) => {
            if (errorRegistrations) {
              return res.status(500).json({
                message: "Error al consultar las inscripciones"
              });
            }

            database.query(
              queries.attended,
              (errorAttended, attendedResult) => {
                if (errorAttended) {
                  return res.status(500).json({
                    message: "Error al consultar las asistencias"
                  });
                }

                res.json({
                  totalEventos: eventsResult[0].total,
                  totalCategorias: categoriesResult[0].total,
                  totalInscripciones:
                    registrationsResult[0].total,
                  totalAsistencias: attendedResult[0].total
                });
              }
            );
          }
        );
      }
    );
  });
};

module.exports = {
  getStatistics
};