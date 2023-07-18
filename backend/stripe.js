require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
const generateStateValue = () => {
  return crypto.randomBytes(16).toString("hex");
};
module.exports = (app) => {
  app.post("/stripe", async (req, res) => {
    const { account_number } = req.body;
    try {
      //   const account = await stripe.accounts.create({
      //     type: "custom",
      //     country: "RO",
      //     email: "aaa@example.com",
      //     capabilities: {
      //       card_payments: { requested: true },
      //       transfers: { requested: true },
      //     },
      //   });
      /*

            'tos_acceptance'
            
            'representative.address.city',
            'representative.address.line1',
            'representative.address.postal_code',

            'representative.email',
            'representative.first_name',
            'representative.last_name',
            'representative.phone',

            'representative.dob.day',
            'representative.dob.month',
            'representative.dob.year',

            'external_account',(iban)
            
      */
      const account_id = "acct_1NUwdFQuykywGMFy";
      if (account_id) {
        const account = await stripe.accounts.retrieve(account_id);
        console.log(account.requirements.currently_due);

        const update = await stripe.accounts.update(account_id, {
          business_profile: {
            mcc: 5950,
            url: "https://google.com",
          },
          business_type: "individual",
          individual: {
            first_name: "Alex",
            last_name: "Mrt",
            phone: "000 000 0000",

            dob: {
              day: 9,
              month: 12,
              year: 2004,
            },
            address: {
              city: "Birmingham",
              line1: "801 Tom Martin Dr. Birmingham",
              postal_code: 35211,
              state: "Alabama",
            },
            email: "aaa@gmail.com",
          },
          external_account: {
            country: "RO",
            currency: "RON",
            object: "bank_account",
            account_number: "RO49AAAA1B31007593840000",
            // routing_number: 110000000,
            // account_number: account_number,
          },
          tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.ip,
          },
        });
        console.log(update);
        res.json(`UPDATED: ${account_id}`);
      }
    } catch (err) {
      res.json(err);
      console.log(err);
    }
  });
  app.get("/stripe", async (req, res) => {
    const state = generateStateValue();
  });

  //   app.get("/callback", async (req, res) => {
  //     const { code, state } = req.query;

  //     try {
  //       const response = await stripe.oauth.token({
  //         grant_type: "authorization_code",
  //         code,
  //       });

  //       const { stripe_user_id } = response;

  //       res.send("Connected account successfully onboarded!");
  //     } catch (error) {
  //       console.error("OAuth error:", error);
  //       res.send("An error occurred during the onboarding process.");
  //     }
  //   });
};
