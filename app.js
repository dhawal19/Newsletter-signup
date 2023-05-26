//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.use(bodyParser.urlencoded({extended: true}));

mailchimp.setConfig({
    apiKey: "18a5610aa7a32b125a59c41b773cfa4e-us14",
    server: "us14"
});



app.post('/', (req, res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;
    const listId = "6438c36552";

    const subscribingUser = {
        firstName: firstName,
        lastName: lastName, 
        email: email
    };


    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        res.sendFile(__dirname+"/success.html");
        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
    }

  
    run().catch(e => res.sendFile(__dirname+"/failure.html"));
});
                
app.post("/failure", (req, res) => {
    res.redirect("/");
});





app.listen(port, () => console.log("Server is running on port " + port + "!"));
//App iD:
//18a5610aa7a32b125a59c41b773cfa4e-us14

//List ID:
//6438c36552