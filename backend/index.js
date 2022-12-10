const express = require("express");
const redis = require("redis");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
app.use(express.json());
app.use(cors());
let redisClient;

//mysql connection

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "redisdb",
});

con.connect(function (err) {});
// Redis connection
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.log("redis error" + error));
  await redisClient.connect();
})();

app.post("/", (req, res) => {
  const message = req.body.message;
  con.query("INSERT INTO messages (message) VALUES (?)", message);
  res.send(message);
  console.log(message);
});

let result = [];
let lengthofresult = 0;
app.get("/:date", async (req, res) => {
  const date = req.params.date;
  const cachedData = await redisClient.get(`${date}`);
  if (cachedData != null) {
    res.send(JSON.parse(cachedData));
    console.log("already cached", cachedData);
  } else {
    /** get from DB **/
    con.query(
      "SELECT * from calendar WHERE date=?",
      date,
      (error, results, fields) => {
        result = Object.values(JSON.parse(JSON.stringify(results)));
        lengthofresult = results.length;
      }
    );
    console.log(result);
    console.log(lengthofresult);
    redisClient.set(`${date}`, JSON.stringify(result));
    // console.log("has been cached", result);

    res.send(result);
  }
});

app.listen(8000, () => {
  console.log("server started at port 8000");
});

// const express = require("express");
// const redis = require("redis");
// const app = express();
// const mysql = require("mysql");
// app.use(express.json());

// let redisClient;
// let messages = [];

// //mysql connection

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "redisdb",
// });

// con.connect(function (err) {});
// // Redis connection
// (async () => {
//   redisClient = redis.createClient();
//   redisClient.on("error", (error) => console.log("redis error" + error));
//   await redisClient.connect();
// })();

// app.post("/", (req, res) => {
//   const message = req.body.message;
//   con.query("INSERT INTO messages (message) VALUES (?)", message);
//   res.send(message);
//   console.log(message);
// });

// app.get("/", async (req, res) => {
//   const cachedData = await redisClient.get("message");
//   if (cachedData) {
//     res.send(JSON.parse(cachedData));
//     console.log("already cached");
//     console.log(cachedData);
//   } else {
//     con.query("SELECT * FROM messages", function (err, result, fields) {
//       result.forEach((row) => {
//         messages.push({ idmessage: row.idmessages, messages: row.message });
//         console.log(row.idmessages, row.message);
//       });
//     });
//     /** get from DB **/
//     // const data = [
//     //   { id: 1, name: "John" },
//     //   { id: 2, name: "Sam" },
//     //   { id: 3, name: "Jonny" },
//     // ];
//     await redisClient.set("message", JSON.stringify(messages));
//     console.log("has been cached", messages);
//     setTimeout(() => {
//       res.send(messages);
//     }, 3000);
//   }
// });

// app.listen(8000, () => {
//   console.log("server started at port 8000");
// });

// const express = require("express");
// const redis = require("redis");
// const app = express();
// const mysql = require("mysql");
// app.use(express.json());

// let redisClient;

// //mysql connection

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "redisdb",
// });

// con.connect(function (err) {
//   if (err) throw err;
//   con.query("SELECT * FROM messages", function (err, result, fields) {
//     for (var i = 1; i < result.length; i++) {
//       redisClient.set(`${i}`, JSON.stringify(result[i]));
//     }
//   });
// });
// // Redis connection
// (async () => {
//   redisClient = redis.createClient();
//   redisClient.on("error", (error) => console.log("redis error" + error));
//   await redisClient.connect();
// })();

// app.post("/", (req, res) => {
//   const message = req.body.message;
//   con.query("INSERT INTO messages (message) VALUES (?)", message);
//   res.send(message);
//   console.log(message);
// });

// let result = [];
// let lengthofresult = 0;
// app.get("/", async (req, res) => {
//   // for (var i = 1; i < result.length; i++) {
//   //     redisClient.set(`${i}`, JSON.stringify(result[i]));
//   //   }
//   //   const cachedData = await redisClient.get("messages");
//   //   if (cachedData != null) {
//   //     res.send(JSON.parse(cachedData));
//   //     console.log("already cached", cachedData);
//   //   } else {
//   //     /** get from DB **/
//   //     con.query("SELECT * from messages", (error, results, fields) => {
//   //       result = Object.values(JSON.parse(JSON.stringify(results)));
//   //       lengthofresult = results.length;
//   //       // for (var i = 1; i < result.length; i++) {
//   //       //   console.log(result[i]);
//   //       // }
//   //     });
//   //     console.log(result);
//   //     console.log(lengthofresult);
//   //     redisClient.set("messages", JSON.stringify(result));
//   //     // console.log("has been cached", result);
//   //     res.send(result);
//   //   }
// });

// app.listen(8000, () => {
//   console.log("server started at port 8000");
// });
