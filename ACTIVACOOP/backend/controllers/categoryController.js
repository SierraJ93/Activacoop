const database = require("../config/database");

// ==========================================
// OBTENER CATEGORÍAS
// ==========================================

const getCategories = (req, res) => {

const sql = `     SELECT *
    FROM categorias
    ORDER BY nombre ASC
  `;

database.query(
    sql,
    (error, results) => {

  if (error) {

    return res.status(500).json({

      message:
        "Error al consultar las categorías"

    });

  }

  res.json(results);

}


);

};

// ==========================================
// CREAR CATEGORÍA
// ==========================================

const createCategory = (req,res) => {

const {nombre,descripcion} = req.body;

if (!nombre) {

return res.status(400).json({

  message:
    "El nombre de la categoría es obligatorio"

});


}

const sql = `     INSERT INTO categorias
    (
      nombre,
      descripcion
    )
    VALUES (?, ?)
  `;

database.query(


sql,

[
  nombre,
  descripcion
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
        "Error al crear la categoría"

    });

  }


  res.status(201).json({

    message:
      "Categoría creada correctamente",

    categoryId:
      result.insertId

  });

}


);

};

// ==========================================
// ELIMINAR CATEGORÍA
// ==========================================

const deleteCategory = (
req,
res
) => {

const {
id
} = req.params;

const sql = `     DELETE FROM categorias
    WHERE id = ?
  `;

database.query(


sql,

[
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
        "No se puede eliminar la categoría. Puede tener eventos asociados."

    });

  }


  if (
    result.affectedRows === 0
  ) {

    return res.status(404).json({

      message:
        "Categoría no encontrada"

    });

  }


  res.json({

    message:
      "Categoría eliminada correctamente"

  });

}


);

};

module.exports = {

getCategories,

createCategory,

deleteCategory

};

