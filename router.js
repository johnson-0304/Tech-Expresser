var express = require("express");
var User = require("./models/user");
var md5 = require("blueimp-md5");

var router = express.Router();

router.get("/", function (req, res) {
  // console.log(req.session.user);
  res.render("index.html", {
    user: req.session.user,
  });
});

router.get("/login", function (req, res) {
  res.render("login.html");
});

router.get("/register", function (req, res) {
  res.render("register.html");
});

router.post("/login", function (req, res) {
  var body = req.body;

  User.findOne(
    {
      username: body.username,
      password: md5(md5(body.password) + "jj"),
    },
    function (err, user) {
      if (err) {
        return res.render("register.html", {
          err_message: "Register unsuccessful, please try it again!",
          form: body,
        });
      }

      if (!user) {
        return res.render("login.html", {
          err_message: "Invalid Username or Password",
          form: body,
        });
      }

      req.session.user = user;

      res.status(200).json({
        err_code: 0,
        message: "OK",
      });
    }
  );
});

// router.post("/login", function(req, res) {
//     var body = req.body;

//     User.findOne({
//             email: body.email,
//             password: md5(md5(body.password) + "jj")
//         },
//         function(err, user) {
//             if (err) {
//                 return res.status(500).json({
//                     err_code: 500,
//                     message: err.message,
//                 });
//             }
//             if (!user) {
//                 return res.render("login.html", {
//                     err_message: "invalid email or username",
//                     form: body,
//                 });
//             }
//             req.session.user = user;

//             res.status(200).json({
//                 err_code: 0,
//                 message: "ok",
//             });

//             // req.session.user = user;
//             // res.status(200).json({
//             //     err_code: 0,
//             //     message: "ok",
//             // });
//         },
//     }););

router.post("/register", function (req, res) {
  var body = req.body;
  User.findOne(
    {
      $or: [
        {
          email: body.email,
        },
        {
          username: body.username,
        },
      ],
    },
    function (err, data) {
      if (err) {
        return res.render("register.html", {
          err_message: "Register unsuccessful, please try it again!",
          form: body,
        });
      }
      if (data) {
        // return res.status(200).json({
        //     err_code: 1,
        //     message: "Username or Email already exists",
        // });
        // console.log("received 1");
        // return res.render("register.html", {
        //     err_message: "Email or Username already exists",
        // });
        //return res.render("register.html", function(err, html) {});
        return res.render("register.html", {
          err_message: "email or username exists",
          form: body,
        });
      }
      body.password = md5(md5(body.password) + "jj");
      new User(body).save(function (err, user) {
        if (err) {
          return res.render("register.html", {
            err_message: "Register unsuccessful, please try it again!",
            form: body,
          });
        }

        req.session.user = user;

        res.status(200).json({
          err_code: 0,
          message: "ok",
        });
      });
    }
  );
});

router.get("/logout", function (req, res) {
  req.session.user = null;
  res.redirect("/login");
});

module.exports = router;
