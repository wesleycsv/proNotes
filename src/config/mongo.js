const { connect } = require("mongoose");
const dotenv = require("dotenv")

dotenv.config()

exports.mongoConnect = async () => {
  try {
    console.log("Connectando ao banco de dados");
    await connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true
    });
    console.log("Connectado ao banco de dados com sucesso");
  } catch (error) {
    console.log(`Error ao conectar com o banco de dados - ERROR: ${error}`);
  }
};
