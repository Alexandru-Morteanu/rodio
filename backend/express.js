const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

const userCollection = require("./modules_mongo/user");
const stationCollection = require("./modules_mongo/station");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        (+new Date()).toString() +
        "." +
        file.originalname.split(".")[1]
    );
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const upload = multer({ storage });

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
//--------------------------------------------------------------------------------
app.post("/deletesong", async (req, res) => {
  let { station, index } = req.body;
  try {
    const findStation = await stationCollection.findOne({ station: station });

    if (fs.existsSync(`${__dirname}/${findStation.album[index].path}`)) {
      fs.unlink(`${__dirname}/${findStation.album[index].path}`, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("succes");
        }
      });
    }
    await stationCollection.updateOne(
      { station: station },
      { $unset: { [`album.${index}`]: null } }
    );
    await stationCollection.updateOne(
      { station: station },
      { $pull: { album: null } }
    );
    res.send("ok");
  } catch {
    res.status(400).json("upload failed");
  }
});

app.post("/upload", upload.any("audio"), async (req, res) => {
  let data = req.files.map((file) => ({
    name: file.originalname,
    path: file.path,
  }));
  const station = req.body.station;
  console.log(station);
  try {
    await stationCollection.updateOne(
      { station: station },
      { $push: { album: { $each: data } } }
    );
    console.log("ok");
    res.send("ok");
  } catch {
    res.status(400).json("upload failed");
  }
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
    album: {
      name: "",
    },
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
//--------------------------------------------------------------------------------
const verifyJWT = (req, res, next) => {
  let token = req.headers.authorization;

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
//--------------------------------------------------------------------------------
app.get("/upload", async (req, res) => {
  const { station, index } = req.query;
  console.log(station);
  try {
    const findStation = await stationCollection.findOne({
      station: station,
    });
    if (findStation) {
      const file = findStation.album[index].path;
      console.log(`${__dirname}/${file}`);
      fs.readFile(`${__dirname}/${file}`, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", data.length);
        res.send(data);
      });
    }
    //res.send(file);
  } catch {}
});
app.get("/uploads", async (req, res) => {
  const { station } = req.query;
  try {
    const findStation = await stationCollection.findOne({
      station: station,
    });
    const names = findStation.album.map((file) => file.name);
    console.log(names);
    res.send({ names: names, indexLength: findStation.album.length });

    /*
    paths.map((path) => {
      fs.readFile(`${__dirname}/${path}`, (err, dat) => {
        if (err) {
          return res.status(500).send(err);
        }
        data.push(dat);
        if (data.length === paths.length) {
          res.setHeader("Content-Type", "audio/mpeg");
          res.setHeader("Content-Length", data.length);
          res.send(data);
        }
      });
    });
    */
  } catch {
    res.status(400).json("upload failed");
  }
});
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
