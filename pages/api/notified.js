const client = require("@mailchimp/mailchimp_marketing")

client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us1",
  });

export default async function handler(req, res) {

    const { email } = req.body

    const response = await client.lists.addListMember("2abee6de60", {
        email_address: email,
        status: "subscribed",
    })

    res.send({response})
}