const express = require("express");
const morgan = require("morgan");
const { Prohairesis } = require("prohairesis");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const mySQLString = process.env.CLEARDB_DATABASE_URL;
const database = new Prohairesis(mySQLString);

app

  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())

  .post("/api/user", async (req, res) => {
    const body = req.body;

    await database.execute(
      `
        insert into users(
            first_name,
            last_name,
            email,
            phone_number,
            password
        )
        values(
            @firstName,
            @lastName,
            @email,
            @phoneNumber,
            @password
        )
    `,
      {
        firstName: body.first,
        lastName: body.last,
        email: body.email,
        phoneNumber: body.phone,
        password: body.password,
      }
    );
    res.end("added user");
  })
  .listen(port, () => console.log(`server listening on port ${port}`));
