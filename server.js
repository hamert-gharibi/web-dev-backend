const express = require("express");
const mongoose = require("mongoose");
//const bodyParser = require("body-parser");
const app = express();

require("dotenv-flow").config();
//swagger deps
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

// import task routes
const taskRoutes = require("./routes/task");
const listRoutes = require("./routes/list");
const authRoutes = require("./routes/auth");

app.use(express.json());
//app.use(bodyParser.json());

//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Welcome to the MEN REST API" });
})

//import routes
app.use("/api/tasks", taskRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/user", authRoutes);




const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT)
})

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log('Error connecting to MongoDB' + error));
mongoose.connection.once('open', () => console.log('Connected succesfully to MongoDB'));




module.exports = app;