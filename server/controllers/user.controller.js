const User = require("../models/user.model.js");

const searchUser = async (req, res) => {
  try {
    let { username, page, limit } = req.query;
    console.log("username --------:", username);
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const skip = (page - 1) * limit;
    const [searchedUsers, totalCount] = await Promise.all([
      User.aggregate([
        {
          $search: {
            index: "username_search",
            autocomplete: {
              path: "userName",
              query: username,
            },
          },
        },
        { $skip: skip },
        { $limit: limit },
        { $project: { userName: 1, email: 1 } },
      ]),
      User.aggregate([
        {
          $search: {
            index: "username_search",
            autocomplete: {
              path: "userName",
              query: username,
            },
          },
        },
        { $count: "totalCount" },
      ]),
    ]);

    const totalPages = totalCount.length > 0 ? Math.ceil(totalCount[0]?.totalCount / limit): 0 ;
    const hasNextPage = page < totalPages;

    return res.status(200).json({
      status: "Success",
      message: "Users Searched Successfully",
      data: searchedUsers,
      hasNextPage,
      totalPages,
    });
  } catch (error) {
    console.log("Error in search user controller :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  searchUser,
};
