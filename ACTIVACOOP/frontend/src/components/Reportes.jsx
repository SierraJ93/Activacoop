import { useState } from "react";
import "../styles/reportes.css";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getEvents,
  getStatistics,
  getEventParticipants,
} from "../services/api";



function Reportes() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // DESCARGAR EXCEL
  // ==========================================

  const descargarExcel = (datos, nombre, hoja) => {
    if (!datos || datos.length === 0) {
      throw new Error("No hay datos para generar el reporte.");
    }

    const worksheet = XLSX.utils.json_to_sheet(datos);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      hoja
    );

    XLSX.writeFile(
      workbook,
      `${nombre}.xlsx`
    );
  };

  // ==========================================
  // DESCARGAR PDF
  // ==========================================

  const descargarPDF = (titulo, columnas, filas, nombre) => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.setTextColor(0, 160, 82);

    doc.text(
      "ACTIVACOOP",
      14,
      18
    );

    doc.setFontSize(14);

    doc.setTextColor(40, 40, 40);

    doc.text(
      titulo,
      14,
      30
    );

    doc.setFontSize(9);

    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString("es-CO")}`,
      14,
      38
    );

    autoTable(doc, {
      startY: 45,

      head: [columnas],

      body: filas,

      theme: "grid",

      headStyles: {
        fillColor: [0, 191, 99],
        textColor: [255, 255, 255],
      },

      alternateRowStyles: {
        fillColor: [245, 250, 246],
      },

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
    });

    doc.save(`${nombre}.pdf`);
  };

  // ==========================================
  // REPORTE DE EVENTOS
  // ==========================================

  const exportarEventos = async (formato) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const eventos = await getEvents();

      const datos = eventos.map((evento) => ({
        ID: evento.id,
        Evento: evento.titulo,
        Fecha: evento.fecha,
        Hora: evento.hora,
        Lugar: evento.lugar,
        Cupos: evento.cupos_disponibles,
      }));

      if (formato === "excel") {
        descargarExcel(
          datos,
          "Reporte_Eventos_Activacoop",
          "Eventos"
        );
      } else {
        descargarPDF(
          "Reporte de eventos",
          ["ID", "Evento", "Fecha", "Hora", "Lugar", "Cupos"],
          datos.map((evento) => Object.values(evento)),
          "Reporte_Eventos_Activacoop"
        );
      }

      setMessage("Reporte de eventos generado correctamente.");
    } catch (error) {
      setError(error.message || "Error al generar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REPORTE DE ESTADÍSTICAS
  // ==========================================

  const exportarEstadisticas = async (formato) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const estadisticas = await getStatistics();

      const datos = Array.isArray(estadisticas)
        ? estadisticas
        : Object.entries(estadisticas).map(([indicador, valor]) => ({
            Indicador: indicador,
            Valor:
              typeof valor === "object"
                ? JSON.stringify(valor)
                : valor,
          }));

      if (formato === "excel") {
        descargarExcel(
          datos,
          "Reporte_Estadisticas_Activacoop",
          "Estadisticas"
        );
      } else {
        const columnas = Object.keys(datos[0] || {});

        const filas = datos.map((item) =>
          columnas.map((columna) => item[columna])
        );

        descargarPDF(
          "Reporte estadístico",
          columnas,
          filas,
          "Reporte_Estadisticas_Activacoop"
        );
      }

      setMessage("Reporte estadístico generado correctamente.");
    } catch (error) {
      setError(error.message || "Error al generar estadísticas.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REPORTE DE PARTICIPANTES
  // ==========================================

  const exportarParticipantes = async (formato) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const eventos = await getEvents();

      const resultados = await Promise.all(
        eventos.map(async (evento) => {
          const participantes = await getEventParticipants(evento.id);

          return participantes.map((participante) => ({
            Evento: evento.titulo,
            Participante:
              participante.nombre ||
              participante.nombre_completo ||
              participante.usuario ||
              "No disponible",
            Correo: participante.email || "No disponible",
            Asistencia:
              participante.asistencia ?? "Pendiente",
          }));
        })
      );

      const datos = resultados.flat();

      if (formato === "excel") {
        descargarExcel(
          datos,
          "Reporte_Participantes_Activacoop",
          "Participantes"
        );
      } else {
        descargarPDF(
          "Reporte de participantes",
          ["Evento", "Participante", "Correo", "Asistencia"],
          datos.map((item) => Object.values(item)),
          "Reporte_Participantes_Activacoop"
        );
      }

      setMessage("Reporte de participantes generado correctamente.");
    } catch (error) {
      setError(
        error.message ||
          "Error al generar el reporte de participantes."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <section className="reportes-section">

      <div className="reportes-header">
        <span className="reportes-badge">
          Administración
        </span>

        <h2>Reportes y estadísticas</h2>

        <p>
          Consulta y descarga la información de Activacoop
          en Excel o PDF.
        </p>
      </div>

      {message && (
        <div className="reportes-success">
          {message}
        </div>
      )}

      {error && (
        <div className="reportes-error">
          {error}
        </div>
      )}

      {loading && (
        <p className="reportes-loading">
          Generando reporte, por favor espera...
        </p>
      )}

      <div className="reportes-grid">

        {/* EVENTOS */}

        <article className="reporte-card">
          <div className="reporte-icon">📅</div>

          <h3>Reporte de eventos</h3>

          <p>
            Consulta los eventos, sus fechas, lugares y cupos.
          </p>

          <div className="reporte-actions">
            <button
              type="button"
              onClick={() => exportarEventos("excel")}
              disabled={loading}
              className="btn-excel"
            >
              Descargar Excel
            </button>

            <button
              type="button"
              onClick={() => exportarEventos("pdf")}
              disabled={loading}
              className="btn-pdf"
            >
              Descargar PDF
            </button>
          </div>
        </article>

        {/* ESTADÍSTICAS */}

        <article className="reporte-card">
          <div className="reporte-icon">📊</div>

          <h3>Reporte estadístico</h3>

          <p>
            Consulta las estadísticas generales de la cooperativa.
          </p>

          <div className="reporte-actions">
            <button
              type="button"
              onClick={() => exportarEstadisticas("excel")}
              disabled={loading}
              className="btn-excel"
            >
              Descargar Excel
            </button>

            <button
              type="button"
              onClick={() => exportarEstadisticas("pdf")}
              disabled={loading}
              className="btn-pdf"
            >
              Descargar PDF
            </button>
          </div>
        </article>

        {/* PARTICIPANTES */}

        <article className="reporte-card">
          <div className="reporte-icon">👥</div>

          <h3>Reporte de participantes</h3>

          <p>
            Consulta los afiliados inscritos en los eventos.
          </p>

          <div className="reporte-actions">
            <button
              type="button"
              onClick={() => exportarParticipantes("excel")}
              disabled={loading}
              className="btn-excel"
            >
              Descargar Excel
            </button>

            <button
              type="button"
              onClick={() => exportarParticipantes("pdf")}
              disabled={loading}
              className="btn-pdf"
            >
              Descargar PDF
            </button>
          </div>
        </article>

      </div>
    </section>
  );
}

export default Reportes;