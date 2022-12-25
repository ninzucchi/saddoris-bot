const https = require("https");
const twilio = require("twilio");
const express = require("express");

const USERNAME = "substack";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const DESTINATION_PHONE_NUMBER = process.env.DESTINATION_PHONE_NUMBER;

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function queryAPI() {
  console.log(`query: ${USERNAME}`);
  https
    .get(
      `https://api.twitter.com/i/users/username_available.json?full_name=Jeffery%20Saddoris&suggest=true&username=${USERNAME}`,
      (response) => {
        let data = "";

        // A chunk of data has been received.
        response.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on("end", () => {
          const apiResponse = JSON.parse(data);
          if (apiResponse.valid) {
            console.log("valid: \x1b[32mtrue\x1b[0m");
            client.messages
              .create({
                body: `The username ${USERNAME} is available!`,
                from: TWILIO_PHONE_NUMBER,
                to: DESTINATION_PHONE_NUMBER,
              })
              .then((message) => console.log("Text message sent"))
              .catch((error) => console.error(error))
              .done();
          } else {
            console.log("valid: \x1b[31mfalse\x1b[0m");
          }
          console.log(`reason: ${apiResponse.reason}`);
          console.log(`---`);
        });
      }
    )
    .on("error", (error) => {
      console.error(error);
    });
}

setInterval(queryAPI, 10000);

// Create an express app to listen on a port
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
