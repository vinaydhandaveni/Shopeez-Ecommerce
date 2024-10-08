const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const secretKey = "InvictuS";

app.use(cors());
app.use(express.json());
app.get("/", (req, resp) => {
  resp.json({
    message: "a sample",
  });
});

app.post("/token", (req, resp) => {
  const user = req.body;

  if (!user) {
    resp.status(400).json({ error: "Invalid user data" });
    return;
  }

  jwt.sign({ user }, secretKey, { expiresIn: "15s" }, (err, token) => {
    if (err) {
      resp.status(500).json({ error: "Failed to generate token" });
      return;
    }

    resp.json({ token });
  });
});

app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      resp.send({ result: "invalid token" });
    } else {
      resp.json({ message: "Profile accessed", authData });
    }
  });
});

function verifyToken(req, resp, next) {
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    const bearer = bearerToken.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    resp.send({ result: "Token invalid" });
  }
}

app.listen(5000, () => {
  console.log("app is running in 5000");
});
