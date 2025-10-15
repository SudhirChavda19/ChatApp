const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            status: "Fail",
            message: "Need to Sign In",
        });
    }
    try {  
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.userId;
    } catch (err) {
        return res.status(401).json({
            status: "Fail",
            message: "You are not authorized",
        });
    }
    return next();
};