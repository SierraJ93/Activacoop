const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const database = require("../config/database");

// ==========================================
// REGISTRO DE USUARIO
// ==========================================

const register = async (req, res) => {

try {

const {
  nombre,
  email,
  password
} = req.body;


// Validar campos obligatorios

if (
  !nombre ||
  !email ||
  !password
) {

  return res.status(400).json({

    message:
      "Todos los campos son obligatorios"

  });

}


// Verificar si el usuario ya existe

const sqlCheck = `
  SELECT id
  FROM usuarios
  WHERE email = ?
`;


database.query(
  sqlCheck,
  [email],
  async (error, results) => {

    if (error) {

      return res.status(500).json({

        message:
          "Error al verificar el usuario"

      });

    }


    if (results.length > 0) {

      return res.status(400).json({

        message:
          "El correo ya está registrado"

      });

    }


    // Encriptar contraseña

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // Insertar usuario

    const sqlInsert = `
      INSERT INTO usuarios
      (
        nombre,
        email,
        password
      )
      VALUES (?, ?, ?)
    `;


    database.query(
      sqlInsert,
      [
        nombre,
        email,
        hashedPassword
      ],
      (error, result) => {

        if (error) {

          return res.status(500).json({

            message:
              "Error al registrar el usuario"

          });

        }


        res.status(201).json({

          message:
            "Usuario registrado correctamente",

          user: {

            id:
              result.insertId,

            nombre,

            email

          }

        });

      }
    );

  }
);


}

catch (error) {


res.status(500).json({

  message:
    "Error interno del servidor"

});


}

};

// ==========================================
// INICIO DE SESIÓN
// ==========================================

const login = (
req,
res
) => {

const {
email,
password
} = req.body;

// Validar datos

if (
!email ||
!password
) {


return res.status(400).json({

  message:
    "Correo y contraseña son obligatorios"

});


}

const sql = `     SELECT *
    FROM usuarios
    WHERE email = ?
  `;

database.query(
sql,
[email],
async (
error,
results
) => {

  if (error) {

    return res.status(500).json({

      message:
        "Error al consultar el usuario"

    });

  }


  // Verificar usuario

  if (
    results.length === 0
  ) {

    return res.status(401).json({

      message:
        "Correo o contraseña incorrectos"

    });

  }


  const user =
    results[0];


  // Comparar contraseña

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );


  if (
    !passwordMatch
  ) {

    return res.status(401).json({

      message:
        "Correo o contraseña incorrectos"

    });

  }


  // Generar token

  const token =
    jwt.sign(

      {

        id:
          user.id,

        email:
          user.email,

        rol:
          user.rol

      },

      process.env.JWT_SECRET,

      {

        expiresIn:
          "2h"

      }

    );


  res.json({

    message:
      "Inicio de sesión exitoso",

    token,

    user: {

      id:
        user.id,

      nombre:
        user.nombre,

      email:
        user.email,

      rol:
        user.rol

    }

  });

}

);

};

module.exports = {

register,

login

};
