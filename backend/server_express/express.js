const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const userCollection = require("../modules_mongo/user");
const stationCollection = require("../modules_mongo/station");
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/rodio", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed to connect to MongoDB");
    console.error(error);
  }
}
connectToMongoDB();

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const payload = { email: email };
  try {
    const check = await userCollection.findOne({ email: email });
    if (check) {
      const isMatch = await bcrypt.compare(password, check.password);
      console.log(isMatch);
      if (isMatch) {
        res.status(201).json({
          token: generateToken(payload),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (e) {
    res.status(400);
  }
});

app.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const payload = { email: email };
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = {
    email: email,
    password: hashedPassword,
  };
  try {
    const checkUser = await userCollection.findOne({ email: email });
    if (checkUser) {
      res.status(400);
    } else {
      res.status(201).json({
        token: generateToken(payload),
      });
      await userCollection.insertMany([data]);
    }
  } catch (e) {
    next(e);
    res.status(400);
  }
});

app.post("/market", async (req, res, next) => {
  const { stationName } = req.body;
  console.log(stationName);
  const payload = { stationName: stationName };
  const data = {
    station: stationName,
    user: "",
  };
  try {
    const checkStation = await stationCollection.findOne({
      station: stationName,
    });
    if (checkStation) {
      console.log("already exist");
      res.status(400);
    } else {
      res.status(201).json({
        token: generateToken(payload),
      });
      await stationCollection.insertMany([data]);
    }
  } catch (e) {
    next(e);
    res.status(400);
  }
});

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) {
    return res.status(401).send({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.payload.email;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" });
  }
};

app.get("/market", verifyJWT, async (req, res) => {
  try {
    const stations = await stationCollection.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json("error");
  }
});

app.get("/admin", verifyJWT, (req, res) => {
  res.send({ success: "Valid user" });
});

const generateToken = (payload) => {
  return jwt.sign({ payload }, "secret", { expiresIn: "3d" });
};

app.listen(8000, () => {
  console.log("port connected");
});
