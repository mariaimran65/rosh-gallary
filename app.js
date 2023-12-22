let myExpress = require("express");
let multer = require("multer");
let mongoose = require("mongoose");
let jsonwebtoken = require("jsonwebtoken");
const { json } = require("react-router-dom");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "server/my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

let userSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

let User = mongoose.model("user", userSchema);

const upload = multer({ storage: storage });
let myApp = myExpress();
myApp.use(myExpress.json());
let users = [];

myApp.get("/user-Find-Karo", async (req, res) => {
  // console.log(req.query.id);
  const userfound = await User.findById(req.query.id);
  // return myuser.id == req.query.id;

  res.json(userfound);
});
myApp.get("/users-lao", async (req, res) => {
  let users = await User.find();
  res.json(users);
});

myApp.delete("/delete-user/:id", async (req, res) => {
  // console.log(req.params.id, " yh user ki id hy");
  try {
    let users = await User.findByIdAndDelete(req.params.id);
    // console.log(req.query.userKiId);
    res.json({
      success: true,
      data: users,
    });
  } catch (e) {
    // console.log(e.message);
  }
});

myApp.post("/create-user", upload.single("file"), async (req, res) => {
  // console.log(req.body);
  let data = new User(req.body);
  await data.save();
  res.json({
    success: true,
  });
  // users.push(req.body);
});
myApp.post("/check-token", (req, res) => {
  jsonwebtoken.verify(req.body.token, "cat says meows", function (err, myData) {
    let user = users.find((user) => user.name == myData.name);
    res.json(user);
    // console.log(myData);
  });
  // console.log(req.body.token);
});

myApp.post("/login", async (req, res) => {
  let userMilgya = await User.findOne();
  if (userMilgya) {
    jsonwebtoken.sign(
      { name: userMilgya.name },
      "cat says meows",
      {
        expiresIn: "2d",
      },
      function (err, token) {
        res.json({
          myToken: token,
          userMilgya,
        });
      }
    );
  }
});

myApp.put("/update-user", async (req, res) => {
  console.log(req.body, "this is update user");
  const { _id, ...rest } = req.body;
  let users = await User.findOneAndUpdate({ _id: _id }, rest);
  res.json({
    success: true,
  });

  // let userIndex = users.findIndex(function (user) {
  //   return user.id == req.body.id;
  // });
  // if (userIndex != -1) {
  //   users[userIndex] = req.body;
  // }
  // res.json({
  //   success: true,
  // });
  // console.log("a");
});

myApp.use(myExpress.static("./build"));
mongoose
  .connect("mongodb://localhost:27017/myUsers")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log("error occured");
  });

myApp.use(myExpress.static("server/my-uploads"));
myApp.listen(6070, function () {
  console.log("code is chaling now");
});
