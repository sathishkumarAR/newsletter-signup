const express= require("express");
const mailchimp= require("@mailchimp/mailchimp_marketing");
// const bodyParser = require("body-parser");

const app= express();

app.use(express.static("public"));

// app.use(bodyParser.urlencoded({extended:true}));

app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

mailchimp.setConfig({
    apiKey : process.env.API_KEY ,
    server : process.env.SERVER
});

app.post("/", function(req, res){
    const fname= req.body.fname;
    const lname= req.body.lname;
    const email = req.body.email;
    const listId = process.env.LISTID;

    const userData = {
        fname : fname,
        lname : lname,
        email : email
    }

    async function run(){
        const response= await mailchimp.lists.batchListMembers(listId, {
            members :[
                {
                    email_address : userData.email,
                    status : "subscribed",
                    merge_fields : {
                        FNAME : userData.fname,
                        LNAME : userData.lname,
                    }
                }
            ]
        });
        res.sendFile(__dirname+"/success.html");
    }

    run().catch(function(e){
        res.sendFile(__dirname + "/failure.html")
    });    


});

app.post("/failure",function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started and running");
});

//392f5f2252f22548011c7af9ddc13c48-us7

//b72c780998