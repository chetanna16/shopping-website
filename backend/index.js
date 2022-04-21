const express = require("express");
const morgan = require("morgan");
const { Prohairesis } = require("prohairesis");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

const mySQLString =
  "mysql://b3233d3d91a180:feb9359a@us-cdbr-east-05.cleardb.net/heroku_08f087393a44da6?reconnect=true";
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
