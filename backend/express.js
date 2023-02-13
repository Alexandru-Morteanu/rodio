const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const userCollection = require("./modules_mongo/user");
const stationCollection = require("./modules_mongo/station");
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
/*
import multer from 'multer'
import { scryptSync, createCipheriv } from 'crypto'
import { mkdirSync, existsSync, writeFileSync } from 'fs'

const upload = multer({ storage: multer.memoryStorage() })

const encrypt = (buffer) => {
  const algorithm = 'aes-192-cbc'
  const iv = Buffer.alloc(16, 0)
  const key = scryptSync('super strong password', 'salt', 24)

  const cipher = createCipheriv(algorithm, key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const saveEncryptedFile = (buffer, filePath) => {
  if (!existsSync(path.dirname(filePath))) {
    mkdirSync(path.dirname(filePath))
  }
  writeFileSync(filePath, encrypt(buffer))
}
*/

app.post("/upload", upload.single("audio"), async (req, res) => {
  const audio = req.file;
  console.log(req.email);
  // await stationCollection.updateOne(
  //   { station: req.email },
  //   { $push: { stations: findStation.station } }
  // );
});
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

app.post("/market/add", async (req, res, next) => {
  const { stationName } = req.body;
  console.log(stationName);

  const payload = { stationName: stationName };
  const data = {
    station: stationName,
    user: "",
    status: "green",
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

app.post("/market/status", async (req, res, next) => {
  const { station, token } = req.body;
  try {
    const decoded = jwt.verify(token, "secret");
    req.email = decoded.payload.email;
    console.log("decoded=" + req.email);
    const findStation = await stationCollection.findOne({
      station: station,
    });
    console.log(findStation.status);
    if (!findStation) {
      console.log("dont exist");
      res.status(400);
    } else {
      if (findStation.status === "green") {
        await stationCollection.updateOne(
          { _id: findStation._id },
          { $set: { status: "red" } }
        );
        await stationCollection.updateOne(
          { _id: findStation._id },
          { $set: { user: req.email } }
        );
        await userCollection.updateOne(
          { email: req.email },
          { $push: { stations: findStation.station } }
        );
        res.status(201).json(findStation.station);
      } else {
        res.json("busy");
      }
    }
  } catch (e) {
    next(e);
    res.status(400);
  }
});

const verifyJWT = (req, res, next) => {
  let token = req.headers.authorization;
  console.log(token);

  if (!token) {
    return res.status(401).send({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.payload.email;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" });
  }
};

app.get("/market/add", verifyJWT, async (req, res) => {
  try {
    console.log(req.user);
    const stations = await stationCollection.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json("error");
  }
});

app.get("/", async (req, res) => {
  try {
    const stations = await stationCollection.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json("error");
  }
});

app.get("/admin", verifyJWT, async (req, res) => {
  console.log(req.user);
  try {
    const findStation = await userCollection.findOne({
      email: req.user,
    });
    res.json(findStation.stations);
  } catch (error) {
    res.status(500).json("error");
  }
});

const generateToken = (payload) => {
  return jwt.sign({ payload }, "secret", { expiresIn: "3d" });
};

app.listen(8000, () => {
  console.log("port connected");
});
