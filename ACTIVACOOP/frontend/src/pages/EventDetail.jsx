// pagina de detalle del evento


import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getEventById, createRegistration,
} from "../services/api";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [registering, setRegistering] = useState(false);

  // =========================================================
  // CARGAR EVENTO
  // =========================================================

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEventById(id);

        setEvent(data);
      } catch (error) {
        setError(
          error.message ||
            "No fue posible cargar el evento."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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
  // INSCRIPCIÓN
  // =========================================================

  const handleRegistration = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    setMessage(
      "Debes iniciar sesión para inscribirte"
    );

    setTimeout(() =>{
      navigate("/login");
    },1500);

    return;
  }

  if (!event || event.cupos_disponibles <= 0) {
    setMessage("No hay cupos disponibles");

    return;
  }

  if (registering) {
    return;
  }

  try {
    setRegistering(true);
    setMessage("");

    await createRegistration(event.id);

    setEvent((previousEvent) => ({
      ...previousEvent,
      cupos_disponibles:
        previousEvent.cupos_disponibles - 1
    }));

    setMessage(
      "Inscripción realizada correctamente"
    );

  } catch (error) {
    setMessage(
      error.message ||
        "No fue posible realizar la inscripción"
    );

  } finally {
    setRegistering(false);
  }
};

  // =========================================================
  // ESTADO DE CARGA
  // =========================================================

  if (loading) {
    return (
      <main className="event-detail-page">
        <div className="container">
          <div className="event-detail-status">
            Cargando información del evento...
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // ESTADO DE ERROR
  // =========================================================

  if (error || !event) {
    return (
      <main className="event-detail-page">
        <div className="container">
          <div className="event-detail-error">
            <h2>No se pudo cargar el evento</h2>

            <p>
              {error || "El evento no existe."}
            </p>

            <Link
              to="/eventos"
              className="btn-primary"
            >
              Volver a eventos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const availableSlots =
    Number(event.cupos_disponibles || 0);

  const hasAvailableSlots = availableSlots > 0;

  // =========================================================
  // VISTA PRINCIPAL
  // =========================================================

  return (
    <main className="event-detail-page">

      {/* ENCABEZADO */}

      <section className="event-detail-header">

        <div className="container">

          <Link
            to="/eventos"
            className="back-to-events"
          >
            ← Volver a eventos
          </Link>

          <span className="event-detail-category">
            {event.categoria_nombre || "Actividad"}
          </span>

          <h1>
            {event.titulo}
          </h1>

          <p>
            Conoce todos los detalles de esta actividad
            de Activacoop.
          </p>

        </div>

      </section>


      {/* CONTENIDO */}

      <section className="section">

        <div className="container event-detail-layout">

          {/* INFORMACIÓN */}

          <article className="event-detail-card">

            <h2>
              Información del evento
            </h2>

            <div className="event-detail-description">

              <h3>
                Descripción
              </h3>

              <p>
                {event.descripcion ||
                  "No hay una descripción disponible."}
              </p>

            </div>


            <div className="event-detail-information">

              <div className="detail-information-item">

                <span className="detail-icon">
                  📅
                </span>

                <div>
                  <strong>Fecha</strong>

                  <p>
                    {formatDate(event.fecha)}
                  </p>
                </div>

              </div>


              <div className="detail-information-item">

                <span className="detail-icon">
                  ⏰
                </span>

                <div>
                  <strong>Hora</strong>

                  <p>
                    {event.hora
                      ? String(event.hora).slice(0, 5)
                      : "No definida"}
                  </p>
                </div>

              </div>


              <div className="detail-information-item">

                <span className="detail-icon">
                  📍
                </span>

                <div>
                  <strong>Lugar</strong>

                  <p>
                    {event.lugar || "Por confirmar"}
                  </p>
                </div>

              </div>

            </div>

          </article>


          {/* TARJETA DE INSCRIPCIÓN */}

          <aside className="event-registration-card">

            <span className="registration-card-label">
              Disponibilidad
            </span>

            <div className="registration-slots">

              <strong>
                {availableSlots}
              </strong>

              <span>
                cupos disponibles
              </span>

            </div>


            <div
              className={
                hasAvailableSlots
                  ? "detail-availability available"
                  : "detail-availability full"
              }
            >

              {hasAvailableSlots
                ? "✓ Hay cupos disponibles"
                : "✕ No hay cupos disponibles"}

            </div>


            {message && (
              <div
                className={`event-message ${
                  message.toLowerCase().includes("correctamente")
                    ? "success"
                    : "error"
              }`}
            >
              {message}
            </div>
          )}


            <button
              onClick={handleRegistration}
              disabled={
                registering ||
                event.cupos_disponibles <= 0
              }
            >
              {registering
                ? "Procesando..."
                : event.cupos_disponibles <= 0
                  ? "Sin cupos"
                  : "Inscribirme"}
            </button>


            <p className="registration-note">
              Debes iniciar sesión para realizar
              una inscripción.
            </p>

          </aside>

        </div>

      </section>

    </main>
  );
}

export default EventDetail;
