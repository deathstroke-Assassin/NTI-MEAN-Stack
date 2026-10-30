const { MongoClient, mongoConnection } = require("../models/mongodbConnection");
const authModelApi = require("../models/authModelApi");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

async function dashboard(req, res) {
  let client;

  try {
    client = new MongoClient(mongoConnection);
    await client.connect();

    const db = client.db();

    const [totalProducts, totalCategories, totalOrders, lowStockProducts] =
      await Promise.all([
        db.collection("products").countDocuments(),
        db.collection("categories").countDocuments(),
        db.collection("orders").countDocuments(),
        db.collection("products").countDocuments({
          stock: { $lte: 5 },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalOrders,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

const signin = (req, res) => {
  authModelApi.signin(req.body).then((users) => {
    if (users.length == 0) {
      return res.status(401).json({ login: "failed, no user name valid" });
    } else {
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, result) {
          if (err) {
            //
          }
          if (result) {
            // success sign in
            const payload = {
              userId: users[0]._id,
              fullname: users[0].fullname,
              userRole: users[0].userRole,
            };

            const secretKey = process.env.JWT_SECRET_KEY;

            const token = jwt.sign(payload, secretKey, { expiresIn: "300d" }); // 6000 = 6sec , 1d , 1h

            return res
              .status(200)
              .json({
                login: "done",
                token: token,
                userRole: users[0].userRole,
              });
          } else {
            return res.status(401).json({ login: "failed, no password valid" });
          }
        },
      );
    }
  });
};

const verifySignin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }
    const token = authHeader.split(" ")[1];
    const secretKey = process.env.JWT_SECRET_KEY;
    var decodedToken = jwt.verify(token, secretKey);
  } catch (error) {
    return res.status(401).json({ login: "failed, no or Wrong token sent" });
  }

  const id = decodedToken.userId;
  const fullname = decodedToken.fullname;
  const userRole = decodedToken.userRole;

  req.user = { id, fullname, userRole };

  authModelApi.verifySignin(id, userRole).then((users) => {
    if (users.length == 0) {
      return res
        .status(401)
        .json({ login: "failed, no user with this ID or Role" });
    } else {
      next();
    }
  });
};

module.exports = {
  dashboard,
  signin,
  verifySignin,
};
