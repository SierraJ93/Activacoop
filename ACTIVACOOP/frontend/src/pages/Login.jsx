// pagina de inicio de sesion
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================================================
  // CAMBIAR CAMPOS
  // =========================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };


  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const data = await loginUser(
        formData.email,
        formData.password
      );

      // Guardar token
      localStorage.setItem(
        "token",
        data.token
      );

      // Guardar información del usuario
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Ir al inicio
      navigate("/");

    } catch (error) {

      setError(
        error.message ||
        "No fue posible iniciar sesión."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <main className="form-page">

      <section className="form-card">

        <h1>
          Iniciar sesión
        </h1>

        <p>
          Ingresa a tu cuenta de Activacoop
        </p>


        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          {/* CORREO */}

          <label>
            Correo electrónico

            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </label>


          {/* CONTRASEÑA */}

          <label>
            Contraseña

            <input
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </label>


          {/* BOTÓN */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}

          </button>

        </form>


        {/* REGISTRO */}

        <div className="form-footer">

          ¿No tienes una cuenta?{" "}

          <Link to="/registro">
            Crear cuenta
          </Link>

        </div>

      </section>

    </main>

  );
}

export default Login;
