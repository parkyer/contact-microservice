const express = require('express');
const cors = require('cors');
const path = require('path');


const { json, urlencoded} = express;

const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Customer API",
        description: "Customer API Information",
        contact: {
          name: "Amazing Developer"
        },
        servers: ["http://localhost:8080"]
      }
    },
    apis: ["app.js"]
  };

const app = express()
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080

const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

var mysql = require('mysql');
var idmensaje = 0
var id_usuario = 20
var mensaje = ""
var tipo =  ""


var con = mysql.createConnection({
    host: "dbcontacto.cvq8lckp8mio.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "admin123",
    database : 'db_contacto'
  });
  
  // Funcion que nos permite comprobar la conexión a la base de datos.
   con.connect(function(err) {
     if (err) throw err;
     console.log("Connected!");
    });
/**
 * @swagger
 * /inicio:
 *  get:
 *    description: Muestra un json con todos los mensajes en la Base de Datos
 *    responses:
 *      '200':
 *        description: Respuesta Satisfactoria
 */
app.use('/inicio', (req, res) =>{
    con.query('select * from mensajes', function(error,results,fields){
        if(error){
            throw error;
        }else{
            res.send(results)
            results.forEach(result => {
                console.log(result);
            });
        }
    })
})
var mensajeSalida = '{ "mensaje": "Mensaje Recibido" }'
/**
 * @swagger
 * /contacto:
 *  post:
 *    description: Envia un mensaje
 *    responses:
 *      '200':
 *        description: Respuesta Satisfactoria
 *    parameters:
 *       - in: body
 *         name: Contacto
 *         description: Enviar mensaje
 *         schema:
 *           type: object
 *           required:
 *             - mensaje
 *             - idmensaje
 *             - id_usuario
 *             - tipo
 *           properties:
 *             mensaje:
 *               type: string
 *               default: Ecriba su mensaje
 *             idmensaje:
 *               type: integer
 *             id_usuario:
 *               type: integer
 *             tipo:
 *               type: string
 *               default: Entrada
 */
app.post('/contacto', function (req, res) {
    mensaje = req.body.mensaje;
    tipo = req.body.tipo;
    idmensaje = req.body.idmensaje;
    id_usuario = req.body.id_usuario;
    var sql = "INSERT INTO `db_contacto`.`mensajes` (`idmensajes`, `id_usuario`, `mensaje`, `tipo`) VALUES ('" + idmensaje + "', '" + id_usuario + "', '" + mensaje + "', '" + tipo + "')";
    con.query(sql, function(error,results,fields){})
    idmensaje = idmensaje + 1
    var sqlSalida = "INSERT INTO `db_contacto`.`mensajes` (`idmensajes`, `id_usuario`, `mensaje`, `tipo`) VALUES ('" + idmensaje + "', '" + 0 + "', '" + mensajeSalida + "', 'Salida')";
    con.query(sqlSalida, function(error,results,fields){})
    res.send(mensajeSalida);
  });

app.listen(port, () => {
    console.log("Server listening")
})