require('dotenv').config()
const { urlencoded } = require('express');
const express = require('express');
const request = require('request');
const https = require('https');
const { url } = require('inspector');
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static('public'));
app.use("/css", express.static(__dirname + 'public/css'));
app.use("/js", express.static(__dirname + 'public/js'));
app.use("/img", express.static(__dirname + 'public/img'));

// Set Views
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/signup", (req, res) => {
    res.render('sign-up', {title: `sign up`});
});

app.post("/signup", (req, res) => {
    const fname = req.body.inputFname;
    const lname = req.body.inputLname;
    const email = req.body.inputEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const dataJson = JSON.stringify(data);
    const url = `https://us13.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;
    const options = {
        method: "POST",
        auth: `rafli:${process.env.API_KEY}`
    };

    const request = https.request(url, options, (response) => {
        response.on("data", (data) => {
            // console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/views/success.html");
            } else {
                res.sendFile(__dirname + "/views/failure.html");
            }
        })
    })
    request.write(dataJson);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/signup");
})

app.listen(process.env.PORT || 3000);
