
import { useEffect, useState } from "react";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  createCategory,
  deleteCategory,
  getEventParticipants,
  updateAttendance,
  getStatistics
} from "../services/api";

import Reportes from "../components/Reportes";




function Admin() {
  // =========================================================
  // ESTADOS
  // =========================================================

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [participants, setParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    lugar: "",
    cupos_disponibles: "",
    categoria_id: "",
  });

  const [statistics, setStatistics] = useState({
  totalEventos: 0,
  totalCategorias: 0,
  totalInscripciones: 0,
  totalAsistencias: 0
  });





  // =========================================================
  // CARGAR EVENTOS
  // =========================================================

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  // =========================================================
  // CARGAR CATEGORÍAS
  // =========================================================

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  // =========================================================
  // CARGAR ESTADISTICAS
  // =========================================================
  const loadStatistics = async () => {
  try {
    const data = await getStatistics();

    setStatistics(data);
  } catch (error) {
    setMessage(error.message);
  }
  };

  // =========================================================
  // CARGAR DATOS INICIALES
  // =========================================================

useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true);

    try {
      await Promise.all([
        loadEvents(),
        loadCategories(),
        loadStatistics(),
      ]);
    } catch (error) {
      console.error("Error al cargar los datos iniciales:", error);

      setMessage(
        error.message ||
          "Error al cargar la información inicial."
      );
    } finally {
      setLoading(false);
    }
  };

  loadInitialData();
}, []);




  // =========================================================
  // CAMBIAR FORMULARIO DE EVENTOS
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // CREAR O ACTUALIZAR EVENTO
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

      const validationError = validateEventForm();

  if (validationError) {
    setMessage(validationError);
    return;
  }

    try {
      if (editingId !== null) {
        await updateEvent(editingId, formData);

        setMessage(
          "Evento actualizado correctamente."
        );
      } else {
        await createEvent(formData);

        setMessage("Evento creado correctamente.");
      }

      setFormData({
        titulo: "",
        descripcion: "",
        fecha: "",
        hora: "",
        lugar: "",
        cupos_disponibles: "",
        categoria_id: "",
      });

      setEditingId(null);

      await loadEvents();
    } catch (error) {
      setMessage(
        error.message ||
          "Error al guardar el evento."
      );
    }
  };

  // =========================================================
  // EDITAR EVENTO
  // =========================================================

  const handleEdit = (event) => {
    setEditingId(event.id);

    setFormData({
      titulo: event.titulo || "",
      descripcion: event.descripcion || "",
      fecha: event.fecha
        ? String(event.fecha).slice(0, 10)
        : "",
      hora: event.hora
        ? String(event.hora).slice(0, 5)
        : "",
      lugar: event.lugar || "",
      cupos_disponibles:
        event.cupos_disponibles ?? "",
      categoria_id: event.categoria_id ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CANCELAR EDICIÓN
  // =========================================================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      titulo: "",
      descripcion: "",
      fecha: "",
      hora: "",
      lugar: "",
      cupos_disponibles: "",
      categoria_id: "",
    });

    setMessage("");
  };

  // =========================================================
  // ELIMINAR EVENTO
  // =========================================================

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "¿Deseas eliminar este evento?"
    );

    if (!confirmation) {
      return;
    }

    try {
      await deleteEvent(id);

      setMessage(
        "Evento eliminado correctamente."
      );

      if (selectedEvent === id) {
        setSelectedEvent(null);
        setParticipants([]);
      }

      await loadEvents();
    } catch (error) {
      setMessage(
        error.message ||
          "Error al eliminar el evento."
      );
    }
  };

  // =========================================================
  // CAMBIAR FORMULARIO DE CATEGORÍAS
  // =========================================================

  const handleCategoryChange = (event) => {
    const { name, value } = event.target;

    setCategoryForm((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================================
  // CREAR CATEGORÍA
  // =========================================================

  const handleCreateCategory = async (event) => {
  event.preventDefault();

  const categoryName =
    categoryForm.nombre.trim();

  const categoryDescription =
    categoryForm.descripcion.trim();

  if (!categoryName) {
    setMessage(
      "El nombre de la categoría es obligatorio"
    );

    return;
  }

  if (categoryName.length < 3) {
    setMessage(
      "El nombre debe tener al menos 3 caracteres"
    );

    return;
  }

  if (categoryDescription.length < 5) {
    setMessage(
      "La descripción debe tener al menos 5 caracteres"
    );

    return;
  }

  try {
    await createCategory({
      nombre: categoryName,
      descripcion: categoryDescription
    });

    setMessage(
      "Categoría creada correctamente"
    );

    setCategoryForm({
      nombre: "",
      descripcion: ""
    });

    await loadCategories();

  } catch (error) {
    setMessage(
      error.message ||
        "Error al crear la categoría"
    );
  }
};
  // =========================================================
  // ELIMINAR CATEGORÍA
  // =========================================================

  const handleDeleteCategory = async (id) => {
    const confirmation = window.confirm(
      "¿Deseas eliminar esta categoría?"
    );

    if (!confirmation) {
      return;
    }

    try {
      await deleteCategory(id);

      setMessage(
        "Categoría eliminada correctamente."
      );

      await loadCategories();
    } catch (error) {
      setMessage(
        error.message ||
          "No se pudo eliminar la categoría. Puede estar relacionada con un evento."
      );
    }
  };

  // =========================================================
  // CONSULTAR PARTICIPANTES
  // =========================================================

  const handleParticipants = async (eventId) => {
    try {
      const data =
        await getEventParticipants(eventId);

      setParticipants(data);
      setSelectedEvent(eventId);
      setMessage("");
    } catch (error) {
      setMessage(
        error.message ||
          "Error al cargar los participantes."
      );
    }
  };

  // =========================================================
  // CERRAR PARTICIPANTES
  // =========================================================

  const handleCloseParticipants = () => {
    setSelectedEvent(null);
    setParticipants([]);
  };

  // =========================================================
  // ACTUALIZAR ASISTENCIA
  // =========================================================

  const handleAttendance = async (
    registrationId,
    asistencia
  ) => {
    try {
      await updateAttendance(
        registrationId,
        asistencia
      );

      setMessage(
        "Asistencia actualizada correctamente."
      );

      if (selectedEvent !== null) {
        await handleParticipants(selectedEvent);
      }
    } catch (error) {
      setMessage(
        error.message ||
          "Error al actualizar la asistencia."
      );
    }
  };


  const validateEventForm = () => {
  const title = formData.titulo.trim();
  const description = formData.descripcion.trim();
  const date = formData.fecha;
  const place = formData.lugar.trim();
  const availableSlots = Number(
    formData.cupos_disponibles
  );

  if (!title) {
    return "El título del evento es obligatorio";
  }

  if (title.length < 5) {
    return "El título debe tener al menos 5 caracteres";
  }

  if (!description) {
    return "La descripción es obligatoria";
  }

  if (!date) {
    return "La fecha del evento es obligatoria";
  }

  if (place.length < 3) {
    return "El lugar debe tener al menos 3 caracteres";
  }

  if (
    !Number.isInteger(availableSlots) ||
    availableSlots <= 0
  ) {
    return "Los cupos deben ser un número mayor que cero";
  }

  if (!formData.categoria_id) {
    return "Debes seleccionar una categoría";
  }

  return null;
};

  // =========================================================
  // ESTADO DE CARGA
  // =========================================================

  if (loading) {
    return (
      <main className="admin-page">
        <div className="container">
          <div className="admin-section">
            <p>Cargando panel administrativo...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // RENDERIZADO
  // =========================================================

  return (
    <main className="admin-page">

      {/* ENCABEZADO */}

      <header className="admin-header">
        <div className="container">
          <h1>Panel administrativo</h1>

          <p>
            Gestiona los eventos, categorías y
            participantes de Activacoop.
          </p>
        </div>
      </header>


      <div className="container">

        {/* MENSAJE */}

        {message && (
          <div className="admin-message">
            {message}
          </div>
        )}


        {/* =================================================
            CATEGORÍAS
        ================================================== */}

        <section className="admin-section">

          <h2>Gestión de categorías</h2>

          <form
            onSubmit={handleCreateCategory}
            className="category-form"
          >

            <input
              type="text"
              name="nombre"
              placeholder="Nombre de categoría"
              value={categoryForm.nombre}
              onChange={handleCategoryChange}
              required
            />

            <input
              type="text"
              name="descripcion"
              placeholder="Descripción"
              value={categoryForm.descripcion}
              onChange={handleCategoryChange}
            />

            <button
              type="submit"
              className="admin-button admin-button-primary"
            >
              Crear categoría
            </button>

          </form>


          <div className="category-list">

            {categories.length === 0 ? (
              <p>No hay categorías registradas.</p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="category-item"
                >

                  <div>
                    <strong>
                      {category.nombre}
                    </strong>

                    <p>
                      {category.descripcion ||
                        "Sin descripción"}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="admin-button admin-button-danger"
                    onClick={() =>
                      handleDeleteCategory(
                        category.id
                      )
                    }
                  >
                    Eliminar
                  </button>

                </div>
              ))
            )}

          </div>

        </section>

        {/* =================================================
                TARJETAS ESTADISTICAS
        ================================================== */}
        <section className="statistics-section">
          <h2>Resumen general</h2>

          <div className="statistics-grid">
            <div className="stat-card">
              <h3>Eventos</h3>
              <p>{statistics.totalEventos}</p>
            </div>

          <div className="stat-card">
            <h3>Categorías</h3>
            <p>{statistics.totalCategorias}</p>
          </div>

          <div className="stat-card">
            <h3>Inscripciones</h3>
            <p>{statistics.totalInscripciones}</p>
          </div>

          <div className="stat-card">
            <h3>Asistencias</h3>
            <p>{statistics.totalAsistencias}</p>
          </div>
          </div>
        </section>



        {/* =================================================
            FORMULARIO DE EVENTOS
        ================================================== */}

        <section className="admin-section">

          <h2>
            {editingId !== null
              ? "Editar evento"
              : "Crear evento"}
          </h2>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            <div className="admin-form-group">
              <label htmlFor="titulo">
                Título del evento
              </label>

              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                minLength={5}
                maxLength={150}
                required
              />
            </div>


            <div className="admin-form-group">
              <label htmlFor="lugar">
                Lugar
              </label>

              <input
                id="lugar"
                type="text"
                name="lugar"
                placeholder="Lugar del evento"
                value={formData.lugar}
                onChange={handleChange}
              />
            </div>


            <div className="admin-form-group full-width">
              <label htmlFor="descripcion">
                Descripción
              </label>

              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                minLength={5}
                required
              />
            </div>


            <div className="admin-form-group">
              <label htmlFor="fecha">
                Fecha
              </label>

              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                />
            </div>


            <div className="admin-form-group">
              <label htmlFor="hora">
                Hora
              </label>

              <input
                id="hora"
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
              />
            </div>


            <div className="admin-form-group">
              <label htmlFor="cupos_disponibles">
                Cupos disponibles
              </label>

              <input
                type="number"
                name="cupos_disponibles"
                value={formData.cupos_disponibles}
                onChange={handleChange}
                min="1"
                max="10000"
                required
              />

            </div>


            <div className="admin-form-group">
              <label htmlFor="categoria_id">
                Categoría
              </label>

              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">
                  Selecciona una categoría
                </option>

                {categories.map((category) => (
                  <option
                  key={category.id}
                  value={category.id}
                  >
                    {category.nombre}
                  </option>
                ))}
              </select>
            </div>


            <div className="admin-actions">

              <button
                type="submit"
                className="admin-button admin-button-primary"
              >
                {editingId !== null
                  ? "Actualizar evento"
                  : "Crear evento"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={handleCancelEdit}
                >
                  Cancelar edición
                </button>
              )}

            </div>

          </form>

        </section>


        {/* =================================================
            LISTA DE EVENTOS
        ================================================== */}

        <section className="admin-section">

          <h2>Eventos registrados</h2>

          {events.length === 0 ? (
            <p>No hay eventos registrados.</p>
          ) : (

            <div className="admin-events-grid">

              {events.map((event) => (

                <article
                  key={event.id}
                  className="admin-event-card"
                >

                  <h3>
                    {event.titulo}
                  </h3>

                  <p>
                    {event.descripcion ||
                      "Sin descripción"}
                  </p>

                  <p>
                    <strong>Fecha:</strong>{" "}
                    {event.fecha
                      ? String(event.fecha).slice(0, 10)
                      : "Sin fecha"}
                  </p>

                  <p>
                    <strong>Hora:</strong>{" "}
                    {event.hora
                      ? String(event.hora).slice(0, 5)
                      : "Sin hora"}
                  </p>

                  <p>
                    <strong>Lugar:</strong>{" "}
                    {event.lugar || "Sin lugar"}
                  </p>

                  <p>
                    <strong>Cupos:</strong>{" "}
                    {event.cupos_disponibles}
                  </p>

                  <p>
                    <strong>Categoría:</strong>{" "}
                    {event.categoria_nombre ||
                      "Sin categoría"}
                  </p>


                  <div className="admin-actions">

                    <button
                      type="button"
                      className="admin-button admin-button-secondary"
                      onClick={() =>
                        handleEdit(event)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="admin-button admin-button-danger"
                      onClick={() =>
                        handleDelete(event.id)
                      }
                    >
                      Eliminar
                    </button>

                    <button
                      type="button"
                      className="admin-button admin-button-primary"
                      onClick={() =>
                        handleParticipants(event.id)
                      }
                    >
                      Participantes
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


        {/* =================================================
            PARTICIPANTES
        ================================================== */}

        {selectedEvent !== null && (

          <section className="admin-section participants-section">

            <div className="participants-header">

              <h2>
                Participantes del evento
              </h2>

              <button
                type="button"
                className="admin-button admin-button-secondary"
                onClick={handleCloseParticipants}
              >
                Cerrar
              </button>

            </div>


            {participants.length === 0 ? (

              <p>
                No hay participantes registrados.
              </p>

            ) : (

              <div className="participants-list">

                {participants.map((participant) => (

                  <article
                    key={participant.inscripcion_id}
                    className="participant-card"
                  >

                    <div>

                      <strong>
                        {participant.nombre}
                      </strong>

                      <p>
                        <strong>Correo:</strong>{" "}
                        {participant.email}
                      </p>

                      <p>
                        <strong>Estado:</strong>{" "}
                        {participant.estado}
                      </p>

                      <p>
                        <strong>
                          Fecha de inscripción:
                        </strong>{" "}
                        {participant.fecha_inscripcion
                          ? new Date(
                              participant.fecha_inscripcion
                            ).toLocaleDateString("es-CO")
                          : "No disponible"}
                      </p>

                    </div>


                    <div>

                      <label htmlFor={`attendance-${participant.inscripcion_id}`}>
                        <strong>Asistencia:</strong>
                      </label>

                      <select
                        id={`attendance-${participant.inscripcion_id}`}
                        value={
                          participant.asistencia ||
                          "pendiente"
                        }
                        onChange={(event) =>
                          handleAttendance(
                            participant.inscripcion_id,
                            event.target.value
                          )
                        }
                      >

                        <option value="pendiente">
                          Pendiente
                        </option>

                        <option value="asistio">
                          Asistió
                        </option>

                        <option value="no_asistio">
                          No asistió
                        </option>

                      </select>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        )}

      </div>

      <Reportes />

    </main>
  );
}

export default Admin;
