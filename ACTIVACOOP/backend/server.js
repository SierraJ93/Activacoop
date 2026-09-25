// servidor backend de  Activacoop
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// rutas 
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");


const app = express();


// MIDDLEWARES

app.use(cors());

app.use(express.json());

//RUTAS 

app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventRoutes);
app.use("/api/inscripciones",registrationRoutes);
app.use("/api/categorias",categoryRoutes);
app.use("/api/estadisticas", statisticsRoutes);

// ruta de prueba o principal
app.get("/", (req, res) => {
res.json({
message: "Servidor Activacoop funcionando correctamente"
});

});

// PUERTO

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

console.log(
`Servidor ejecutándose en http://localhost:${PORT}`
);

});
