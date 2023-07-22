require("dotenv").config();
const userCollection = require("./modules_mongo/user");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports = (app) => {
  app.post("/api/stripe_create", async (req, res) => {
    const { token, email, first_name, last_name, phone } = req.body;
    try {
      const decoded = jwt.verify(token, "secret");
      const email_check = decoded.payload.email;
      const user = await userCollection.findOne({ email: email_check });
      if (user.stripe === "") {
        const phoneNumber = `+40${phone.replace(/\s/g, "")}`;
        const account = await stripe.accounts.create({
          type: "custom",
          country: "RO",
          email: email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.ip,
          },
          business_profile: {
            mcc: 5950,
            url: "https://google.com",
          },
          business_type: "individual",
          individual: {
            first_name: first_name,
            last_name: last_name,
            phone: phoneNumber,
            email: email,
          },
        });
        const account_id = "acct_1NVxhHR9HTJDj3Jg";
        if (account_id) {
          const account = await stripe.accounts.retrieve(account_id);
          console.log(account.requirements.currently_due);
          const update = await stripe.accounts.update(account_id, {
            tos_acceptance: {
              date: Math.floor(Date.now() / 1000),
              ip: req.ip,
            },
            business_profile: {
              mcc: 5950,
              url: "https://google.com",
            },
            business_type: "individual",
            individual: {
              first_name: first_name,
              last_name: last_name,
              phone: phoneNumber,
              email: email,
            },
          });
          console.log(update);
        }
        if (account.id) {
          await userCollection.updateOne(
            { email: email_check },
            { $set: { stripe: account.id } }
          );
        }
        res.status(200).json(account.id);
      } else {
        res.json("Already created");
      }
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  });
  app.post("/api/stripe_final", async (req, res) => {
    const { token, day, month, year, city, line1, postal_code, iban, account } =
      req.body;
    try {
      const decoded = jwt.verify(token, "secret");
      const email_check = decoded.payload.email;
      const user = await userCollection.findOne({ email: email_check });
      console.log(user.stripe_complete);
      if (!user.stripe_complete) {
        const account_id = account;
        if (account_id) {
          const account = await stripe.accounts.retrieve(account_id);
          console.log(account.requirements.currently_due);
          const update = await stripe.accounts.update(account_id, {
            individual: {
              dob: {
                day: day,
                month: month,
                year: year,
              },
              address: {
                city: city,
                line1: line1,
                postal_code: postal_code,
                state: "Romania",
              },
            },
            external_account: {
              country: "RO",
              currency: "RON",
              object: "bank_account",
              account_number: iban,
              //RO49AAAA1B31007593840000
              // routing_number: 110000000,
              // account_number: account_number,
            },
          });
          await userCollection.updateOne(
            { email: email_check },
            { $set: { stripe_complete: true } }
          );
          console.log(update);
          res.json(`UPDATED: ${account_id}`);
        }
      } else {
        res.json(`ALREADY DONE`);
      }
    } catch (err) {
      res.json(err);
      console.log(err);
    }
  });
  app.get("/api/stripe_status", async (req, res) => {
    const { token, cases } = req.query;
    try {
      const decoded = jwt.verify(token, "secret");
      const email_check = decoded.payload.email;
      const user = await userCollection.findOne({ email: email_check });
      console.log(cases);
      switch (cases) {
        case "1":
          if (user.stripe === "") {
            res.json({ stat: false });
          } else {
            if (user.stripe_complete) {
              res.json({ stat: true, path: "completed" });
            } else {
              res.json({ stat: true, path: "final" });
            }
          }
          break;
        case "2":
          res.json(user.stripe_complete);
          break;
      }
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  });
};
