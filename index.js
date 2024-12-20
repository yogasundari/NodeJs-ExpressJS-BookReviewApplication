const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const dotenv = require('dotenv');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
dotenv.config();
const secretKey = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send("Token is required");
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
});

 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));