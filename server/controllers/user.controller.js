const User = require("../models/user.model.js");

const searchUser = async (req, res) => {
    try {
         const { username, page, limit } = req.query;
        const skip = (page - 1) * limit;
        const searchedUsers = await User.aggregate([
            {
                $search: {
                    index: "userName_1",
                    text: {
                        query: username,
                        path: "userName",
                    },
                },
                $limit: limit,
                $skip: skip
            },
        ]);

        if (!searchedUsers) {
            return res.status(404).json({
                status: "Fail",
                message: "Data Not Found",
            });
        }
        return res.status(200).json({
            status: "Success",
            message: "Qustion searched Successfully",
            data: searchedData,
        });
    } catch (error) {
        console.log("Error in search user controller :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
    }
}

module.exports = {
    searchUser
}