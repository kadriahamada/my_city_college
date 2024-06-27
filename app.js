require("dotenv").config();
const express = require("express");
require("express-async-errors");
const Connection = require("./connection");
const { v4: uuid } = require("uuid");
const bcryptjs = require("bcryptjs");
const { format } = require("date-fns");

const db = new Connection();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/users", async (req, res) => {
  const data = req.body;
  const query = `insert into users(id,firstName, lastName,email, password,tel,gender,creationDate,createdBy) values(?,?, ?,?,
?,?, ?,?,?);`;
  const id = uuid();
  const creationDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const hashedpassword = await bcryptjs.hash(data.password, 15);
  const createdBy = id;
  const save = [
    id,
    data.firstName,
    data.lastName,
    data.email,
    hashedpassword,
    data.tel,
    data.gender,
    creationDate,
    createdBy,
  ];

  //   const user = await db.findOne("users", { email: data.email });

  //   if (Object.keys(user).length > 0) {
  //     throw new Error("the user with that email already exist");
  //   }
  const results = await db.execute(query, save);
  res.json({ msg: "data we are having is: ", results });
});

app.get("/", async (req, res) => {
  const query =
    "create table users(id int not null primary key auto_increment)";
  const results = await db.execute(query);
  res.json({ results });
});

app.get("/users/:id", async (req, res) => {
  const user = await db.findOne("users", { id: req.params.id });
  res.status(200).json(user);
});

app.use((err, req, res, next) => {
  res.json({
    message: err.message,
    code: err.code || "app_error",
    statusCode: err.statusCode || 400,
    stack: err.stack,
  });
});

app.listen(4000, async () => {
  await db.connect();
  console.log("Server is runing on port 4000");
});
