// middleware   / porteger las rutas por rol

const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.rol !== "administrador") {
    return res.status(403).json({
      message: "Acceso restringido a administradores",
    });
  }

  next();
};

module.exports = verifyAdmin;
