// pagina de registro de usuario

import {useState} from "react";

import {useNavigate} from "react-router-dom";

import {registerUser} from "../services/api";


// Componente de registro de usuario
function Register() {

const navigate =useNavigate();

const [formData,setFormData] = 
useState({

  nombre: "",
  email: "",
  password: ""

});

 // Estado para mostrar mensajes de éxito o error

const [message,setMessage] =
useState("");

const handleChange =
(event) => {

  setFormData({

    ...formData,

    [

      event.target.name

    ]:

      event.target.value

  });

};


const handleSubmit =
async (
event
) => {


  event.preventDefault();


  try {

    const response =
      await registerUser(
        formData
      );


    setMessage(
      response.message
    );


    setTimeout(
      () => {

        navigate(
          "/login"
        );

      },

      1500
    );

  }

  catch (
    error
  ) {

    setMessage(
      error.message
    );

  }

};


return (

<section>

  <h1>
    Registro de usuario
  </h1>


  <form
    onSubmit={
      handleSubmit
    }
  >


    <input

      type="text"

      name="nombre"

      placeholder=
        "Nombre completo"

      value=
        {formData.nombre}

      onChange=
        {handleChange}

      required

    />


    <input

      type="email"

      name="email"

      placeholder=
        "Correo electrónico"

      value=
        {formData.email}

      onChange=
        {handleChange}

      required

    />


    <input

      type="password"

      name="password"

      placeholder=
        "Contraseña"

      value=
        {formData.password}

      onChange=
        {handleChange}

      required

    />


    <button
      type="submit"
    >

      Registrarme

    </button>
    
  </form>

  {
    message &&
    <p>

      {message}

    </p>
  }


</section>


);

}

export default Register;

