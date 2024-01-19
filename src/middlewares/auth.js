const JWT = require("jsonwebtoken");
require("dotenv").config;

module.exports = {
  private: async function (request, response, next) {
    let sucess = false;
    if (request.headers.authorization) {

      const [authType, token] = request.headers.authorization.split(" ");

      try {
        let user = JWT.verify(token, process.env.JWT_TOKEN);

        request.userAuth = user
        sucess = true;
      } catch (error) {
        return response.status(401).json({ Error: "Não autorizado no JWT" });
      }
    }

    if (sucess) {
      next();
    }
  },
};
