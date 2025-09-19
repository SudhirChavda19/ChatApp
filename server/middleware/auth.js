const jwt = require("jsonwebtoken");

module.exports.auth = async (req, res, next) => {
    console.log('req.cookies :', req.cookies.token);
    console.log('req.headers.cookie :', req.headers);
    let token = req.headers.cookie;
    if (!token) {
        console.log("error", "Need to Sign In");
        return res.status(401).json({
            status: "Fail",
            message: "Need to Sign In",
        });
    }
    try {
        token = token.slice(4, token.length);   
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decode.userId;
    } catch (err) {
        logger.log("error", "You are not authorized");
        return res.status(401).json({
            status: "Fail",
            message: "You are not authorized",
        });
    }
    return next();
};