const User = require("../Models/User");
require("dotenv").config();

const JWT = require("jsonwebtoken");

class userController {
  async create(request, response) {
    const { name, email, password } = request.body;

    let newUser = new User({ name, email, password });

    try {
      await newUser.save();

      let token = JWT.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_TOKEN,
        { expiresIn: "2h" }
      );

      return response.status(201).json({ id: newUser.id, token: token });
    } catch (error) {
      return response
        .status(500)
        .json({ Error: `Error personalizdo ${error}` });
    }
  }

  async list(request, response) {
    try {
      let result = await User.find({});
      return response.status(200).json(result);
    } catch (error) {
      return response
        .status(401)
        .json({ Message: "Nenhuma Lista encontrada error:" + error });
    }
  }

  async login(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(401)
        .json({ Message: "Favor digitar email e senha" });
    }
    try {
      let isEmail = await User.findOne({ email });
      if (!isEmail) {
        return response
          .status(401)
          .json({ Message: "E-mail ou senha incorreta" });
      }

      isEmail.isComparaPasswords(password, function (err, some) {
        if (!some) {
          return response
            .status(401)
            .json({ Message: "E-mail ou senha incorreta" });
        } else {
          let token = JWT.sign(
            { id: isEmail.id, email: isEmail.email },
            process.env.JWT_TOKEN,
            { expiresIn: "2h" }
          );

          return response.status(200).json({ use: isEmail, token: token });
        }
      });
    } catch (error) {
      return response.status(500).json({ Error: "Error do servidor" });
    }

  }

  async edit(request, response) {
    const { name, email } = request.body
    try {
      let userUpdate = await User.findOneAndUpdate(
        { _id: request.userAuth.id },
        { $set: { name, email } }, {
        upset: true, 'new': true
      }
      )
      return response.status(200).json(userUpdate)

    } catch (error) {
      return response.status(500), json({ Error: "Error do servidor" })
    }
  }
  async password(request, response) {
    const { password } = request.body
    try {
      let passUpdateUser = await User.findOne({ _id: request.userAuth.id })
      passUpdateUser.password = password;
      await passUpdateUser.save()
      return response.status(200).json(passUpdateUser)

    } catch (error) {
      return response.status(500), json({ Error: "Error do servidor" })
    }

  }
  async del(request, response) {
    try {
      let deleteUser = await User.findOne({ _id: request.userAuth.id })
      await deleteUser.deleteOne()
      return response.status(200).json({Message:"Usuario deletado"})

    } catch (error) {
      return response.status(500), json({ Error: "Error do servidor" })
    }

  }
}

module.exports = new userController();
