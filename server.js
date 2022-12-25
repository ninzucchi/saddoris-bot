const https = require("https");
const twilio = require("twilio");

const USERNAME = "substack";

const TWILIO_ACCOUNT_SID = "your_account_sid";
const TWILIO_AUTH_TOKEN = "your_auth_token";
const TWILIO_PHONE_NUMBER = "whatsapp:+14155238886";
const DESTINATION_PHONE_NUMBER = "whatsapp:+12034499835";

const client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function queryAPI() {
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
              .then((message) =>
                console.log(`Text message sent: ${message.sid}`)
              )
              .catch((error) => console.error(error))
              .done();
          } else {
            console.log("valid: \x1b[31mfalse\x1b[0m");
          }
          console.log(`reason: ${apiResponse.reason}`);
        });
      }
    )
    .on("error", (error) => {
      console.error(error);
    });
}

setInterval(queryAPI, 10000);
