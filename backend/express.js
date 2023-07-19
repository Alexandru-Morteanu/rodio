require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const paypal = require("paypal-rest-sdk");
const jwt = require("jsonwebtoken");
const app = express();
const userCollection = require("./modules_mongo/user");
const stationCollection = require("./modules_mongo/station");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const appRouter = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require("./stripe.js")(app);

paypal.configure({
  mode: "sandbox", // sandbox or live
  client_id:
    "AaRTEhtrTxRD8uZ9LsieYK_o_YmNnGuCLJj7gOWFBDeg9W-SxLXajlZ9YSxjt0estoJUarlgjGFKMcIc",
  client_secret:
    "EK856vpjwZ4xeJfU7QQHXvDA017iKYIczuzx6uFuY1BYYAkw8HjBMs8kvMuu-hZik9DlzAqs_No8988h",
});

const sendPayment = (recipientEmail, amount, currency) => {
  return new Promise((resolve, reject) => {
    const senderBatchId = Math.random().toString(36).substring(9); // Generate a unique ID for the transaction
    const request = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: "Payment from my app",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: currency,
          },
          note: "Thanks for using my app!",
          sender_item_id: "payment_" + Math.random().toString(36).substring(9),
          receiver: recipientEmail,
        },
      ],
    };

    paypal.payout.create(request, (error, payout) => {
      if (error) {
        reject(error);
      } else {
        resolve(payout);
      }
    });
  });
};
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_STRING, {
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
appRouter.post("/sold", async (req, res) => {
  const { station, token } = req.body;
  try {
    const decoded = jwt.verify(token, "secret");
    const newEmail = decoded.payload.email;
    const findStation = await stationCollection.findOne({ station: station });
    const oldEmail = findStation.user;
    sendPayment("vreuBani@personal.example.com", findStation.price, "USD")
      .then((payout) => console.log(payout))
      .catch((error) => console.error(error));
    await stationCollection.updateOne(
      { station: station },
      { $set: { user: newEmail, status: "red", paypalEmail: "", price: "" } }
    );
    await userCollection.updateOne(
      { email: oldEmail },
      { $pull: { stations: station } }
    );
    await userCollection.updateOne(
      { email: newEmail },
      { $push: { stations: station } }
    );

    res.json("GO");
  } catch {}
});
appRouter.post("/sell", async (req, res) => {
  const { path, paypalEmail, price } = req.body;
  try {
    const findStation = await stationCollection.findOne({ station: path });
    console.log(findStation);
    await stationCollection.updateOne(
      { station: findStation.station },
      { $set: { paypalEmail: paypalEmail, price: price } }
    );
    await stationCollection.updateOne(
      { _id: findStation._id },
      { $set: { status: "rgb(255, 185, 0)" } }
    );
    res.json("ok");
  } catch {
    res.status(400).json("upload failed");
  }
  // sendPayment("sb-wk7c4725139615@personal.example.com", 10, "USD")
  //   .then((payout) => console.log(payout))
  //   .catch((error) => console.error(error));
});

appRouter.post("/login", async (req, res) => {
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

appRouter.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const payload = { email: email };
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = {
    email: email,
    password: hashedPassword,
  };
  try {
    console.log("---->" + email);
    if (!email) {
      res.status(500);
    } else {
      const checkUser = await userCollection.findOne({ email: email });
      if (checkUser) {
        res.status(400);
      } else {
        res.status(201).json({
          token: generateToken(payload),
        });
        await userCollection.insertMany([data]);
      }
    }
  } catch (e) {
    next(e);
    res.status(400);
  }
});

appRouter.post("/market/add", async (req, res, next) => {
  const { stationName } = req.body;
  console.log(stationName);

  const payload = { stationName: stationName };
  const data = {
    station: stationName,
    user: "",
    status: "rgb(13, 255, 0)",
    album: {
      name: "",
    },
    visitors: "0",
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

appRouter.post("/market/status", async (req, res, next) => {
  const { station, token } = req.body;
  try {
    const decoded = jwt.verify(token, "secret");
    req.email = decoded.payload.email;
    const findStation = await stationCollection.findOne({
      station: station,
    });
    console.log(findStation.status);
    if (!findStation) {
      console.log("dont exist");
      res.status(400);
    } else {
      if (
        findStation.status === "rgb(13, 255, 0)" ||
        findStation.user === req.email
      ) {
        if (findStation.status === "rgb(13, 255, 0)") {
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
        }
        res.status(200).json(findStation.station);
      } else if (findStation.status === "rgb(255, 185, 0)") {
        res.status(201).json(findStation.price);
      } else {
        res.status(202).json("busy");
      }
    }
  } catch (e) {
    next(e);
    res.status(400);
  }
});
appRouter.post("/visitors", async (req, res) => {
  const { station } = req.body;
  try {
    console.log(station);
    const findStation = await stationCollection.findOne({
      station: station,
    });

    await stationCollection.updateOne(
      { _id: findStation._id },
      { $set: { visitors: parseInt(findStation.visitors) + 1 } }
    );
    res.status(200).json("perfect");
  } catch {
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
appRouter.get("/visitors", verifyJWT, async (req, res) => {
  const { station } = req.query;
  try {
    const findStation = await stationCollection.findOne({
      station: station,
    });
    res.json(findStation.visitors);
  } catch {
    res.status(400);
  }
});
appRouter.get("/sell", verifyJWT, async (req, res) => {
  const { station } = req.query;
  try {
    const findStation = await stationCollection.findOne({
      station: station,
    });
    console.log(findStation);
    res.json({
      paypalEmail: findStation.paypalEmail,
      price: findStation.price,
    });
  } catch {
    res.status(400);
  }
});
appRouter.get("/market/add", verifyJWT, async (req, res) => {
  try {
    console.log(req.user);
    const stations = await stationCollection.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json("error");
  }
});
appRouter.get("/", async (req, res) => {
  try {
    const stations = await stationCollection.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json("error");
  }
});

appRouter.get("/admin", verifyJWT, async (req, res) => {
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
app.use("/api", appRouter);
app.listen(8000, () => {
  console.log("port connected");
});
