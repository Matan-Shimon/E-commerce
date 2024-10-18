const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    console.log("authHeader\n", authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("token ", token);
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            console.log(user)
            console.log("working!")
            next();
        })
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        console.log("im inside!!!")
        if (req.user.isAdmin){
            console.log("im admin!")
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization};