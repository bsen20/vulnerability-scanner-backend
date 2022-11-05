const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SWEPROJECT";

const signUp = async (req, res) => {
  //already exists user or not
  //encript the password
  //user creating
  //token generation
  const { username, email, password } = req.body;
  try {
    //already exists user or not
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    //encript the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //user creating
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
      },
      SECRET_KEY
    );
    console.log("user creation successfull");
    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signIn = async (req, res) => {
  //already exists user or not
  //decript the password
  //token generation
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      SECRET_KEY
    );
    console.log("user loged in successfully");
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { signIn, signUp };
