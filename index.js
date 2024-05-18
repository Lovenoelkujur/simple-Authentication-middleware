const express = require("express");
const fs = require("node:fs")

const PORT = 9000;

const app = express();

const userData = []; // Array to store user data (in-memory)

// Middleware Function to verify User
function authenticationMiddleware(req, res, next) {
    const userExist = userData.find(elem => req.body.email === elem.email && req.body.password === elem.password);
    if(userExist){
        fs.appendFileSync("login.log", `Request-URL : ${req.url}. User-Name : ${req.body.name}. Date and Time : ${new Date()} \n`)
        next();
    } 
    else{
        res.status(404).json({
            success: false,
            error: "INVALID CREDENTIALS (Middleware error)"
        });
    }
}

app.use(express.json()); // Middleware to parse JSON bodies

// Sign-up (POST)
app.post("/signup", (req, res) => {
    userData.push(req.body);
    res.status(201).json({
        success : true,
        message : "Signup Sucessfully"
    })
});

// User Sign-in (GET)
app.get("/signin", authenticationMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Sign in Successfully"
    });
});

// Undefined path handle
app.use("/*", (req, res) => {
    res.status(404).json({
        success: false,
        error: "Path Not Found"
    });
});

app.listen(PORT, () => {
    console.log(`Express Server is Running at port ${PORT}`);
});
