// pagina de mis inscripciones

import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  getMyRegistrations,
  cancelRegistration,
} from "../services/api";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [cancellingId, setCancellingId] = useState(null);

  // =========================================================
  // CARGAR INSCRIPCIONES
  // =========================================================

  const loadRegistrations =  useCallback (async () => {
    try {

      const data = await getMyRegistrations();

      setRegistrations(data);
    } catch (error) {
      setError(
        error.message ||
          "No fue posible cargar tus inscripciones."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

  const cargarInscripciones = async () => {

    try {

      const data = await getMyRegistrations();

      setRegistrations(data);

      setError("");

    } catch (error) {

      setError(
        error.message ||
        "No fue posible cargar tus inscripciones."
      );

    } finally {

      setLoading(false);

    }

  };

  cargarInscripciones();

}, []);

  // =========================================================
  // FORMATEAR FECHA
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "No definida";
    }

    const dateOnly = String(date).slice(0, 10);
    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) {
      return dateOnly;
    }

    return `${day}/${month}/${year}`;
  };

  // =========================================================
  // CANCELAR INSCRIPCIÓN
  // =========================================================

  const handleCancel = async (registrationId) => {
    const confirmed = window.confirm(
      "¿Deseas cancelar esta inscripción?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(registrationId);
      setMessage("");

      await cancelRegistration(registrationId);

      setMessage(
        "La inscripción fue cancelada correctamente."
      );

      await loadRegistrations();
    } catch (error) {
      setMessage(
        error.message ||
          "No fue posible cancelar la inscripción."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // =========================================================
  // ESTADOS
  // =========================================================

  if (loading) {
    return (
      <main className="registrations-page">
        <div className="container">
          <div className="registration-status">
            Cargando tus inscripciones...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="registrations-page">

      {/* ENCABEZADO */}

      <section className="registrations-header">

        <div className="container">

          <span className="registrations-badge">
            Mi actividad
          </span>

          <h1>
            Mis inscripciones
          </h1>

          <p>
            Consulta los eventos en los que estás inscrito
            y administra tu participación.
          </p>

        </div>

      </section>


      {/* CONTENIDO */}

      <section className="section">

        <div className="container">

          {error && (
            <div className="registration-error">
              {error}
            </div>
          )}

          {message && (
            <div className="registration-message">
              {message}
            </div>
          )}


          {!error && registrations.length === 0 && (

            <div className="registrations-empty">

              <h2>
                No tienes inscripciones
              </h2>

              <p>
                Explora nuestros eventos y participa
                en las actividades de la cooperativa.
              </p>

              <Link
                to="/eventos"
                className="btn-primary"
              >
                Explorar eventos
              </Link>

            </div>

          )}


          {registrations.length > 0 && (

            <div className="registrations-grid">

              {registrations.map((registration) => (

                <article
                  key={registration.id}
                  className="registration-card"
                >

                  {/* ENCABEZADO */}

                  <div className="registration-card-header">

                    <span className="registration-card-icon">
                      📅
                    </span>

                    <span className="registration-state">
                      {registration.estado || "Confirmada"}
                    </span>

                  </div>


                  {/* INFORMACIÓN */}

                  <div className="registration-card-body">

                    <h2>
                      {registration.titulo}
                    </h2>

                    <p className="registration-description">
                      {registration.descripcion ||
                        "Sin descripción disponible."}
                    </p>


                    <div className="registration-details">

                      <p>
                        <strong>Fecha:</strong>{" "}
                        {formatDate(registration.fecha)}
                      </p>

                      <p>
                        <strong>Hora:</strong>{" "}
                        {registration.hora
                          ? String(registration.hora).slice(0, 5)
                          : "No definida"}
                      </p>

                      <p>
                        <strong>Lugar:</strong>{" "}
                        {registration.lugar ||
                          "Por confirmar"}
                      </p>

                      <p>
                        <strong>Inscripción:</strong>{" "}
                        {formatDate(
                          registration.fecha_inscripcion
                        )}
                      </p>

                    </div>

                  </div>


                  {/* ACCIONES */}

                  <div className="registration-card-footer">

                    <Link
                      to={`/eventos/${registration.evento_id}`}
                      className="btn-secondary"
                    >
                      Ver evento
                    </Link>

                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleCancel(registration.inscripcion_id)}
                      disabled={cancellingId === registration.id}
                    >
                      {cancellingId === registration.id
                        ? "Cancelando..."
                        : "Cancelar"}
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default MyRegistrations;
