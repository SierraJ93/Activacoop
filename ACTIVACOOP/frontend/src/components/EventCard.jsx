//componente de la tarjeta de eventos

import { Link } from "react-router-dom";

function EventCard({ event }) {

return (

<article className="event-card">

  <h2>
    {event.titulo}
  </h2>

  <p>
    {event.descripcion}
  </p>

  <p>
    Fecha:
    {" "}
    {event.fecha}
  </p>

  <p>
    Lugar:
    {" "}
    {event.lugar}
  </p>

  <p>
    Cupos disponibles:
    {" "}
    {event.cupos_disponibles}
  </p>

  <Link
    to={`/eventos/${event.id}`}
  >

    Ver evento

  </Link>

</article>

);

}

export default EventCard;

