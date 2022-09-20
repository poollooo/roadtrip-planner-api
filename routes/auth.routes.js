const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();
const nodemailer = require("nodemailer");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

//for token
const jsonWebToken = require("jsonwebtoken");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;
const { TOKEN_SECRET } = process.env;
//transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MDP_MAIL,
  },
});
// Require the User model in order to interact with the database
const User = require("../models/User.model");



router.post("/signup", (req, res) => {
  const { username, password, email } = req.body;

  if (!username) {
    return res.status(400).json({ errorMessage: "Please provide a username." });
  }

  if (password.length < 8) {
    return res.status(400).json({
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi;
  if (!regexEmail.test(email)) {
    return res.status(400).json({
      errorMessage: "Please provide a valid email",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res.status(400).json({ errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          email,
        });
      })
      .then(async (User) => {
        try {
          const emailToken = jsonWebToken.sign(
            {
              user: User._id,
            },
            process.env.EMAIL_SECRET,
            {
              expiresIn: "1d",
            }
          );

          const url = `http://${process.env.ORIGIN}/confirmation/${emailToken}`;

          await transporter.sendMail({
            to: User.email,
            subject: "Confirm Email",
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
          });

          const payload = { User: User._id };

          const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "7d",
          });

          res
            .status(201)
            .json({ message: "User created", status: "Mail sent at " + email, token: token });
        } catch (error) {
          next(error)
        }
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res.status(400).json({ errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).json({
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }

        return res.status(500).json({ errorMessage: error.message });
      });
  });
});

router.get("/confirmation/:tokenId", async (req, res, next) => {
  try {
    const tokenValid = jsonWebToken.verify(
      req.params.tokenId,
      process.env.EMAIL_SECRET
    );

    await User.findOneAndUpdate({ _id: tokenValid.user }, { isValid: true });

    res.json({ message: "Your account is now valid" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your username." });
  }

  if (!password) {
    return res
      .status(400)
      .json({ errorMessage: "Please provide your password." });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).json({ errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).json({ errorMessage: "Wrong credentials." });
        }

        const payload = { user: user._id };

        const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "7d",
        });

        // req.session.user = token;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.json(token);
      });
    })

    .catch((error) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(error);
      // return res.status(500).render("login", { errorMessage: error.message });
    });
});

router.get('/verify', (req, res, next) => {

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req)

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

//verification of the email (sending)

module.exports = router;
