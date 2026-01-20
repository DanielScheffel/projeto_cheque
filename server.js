import dotenv from "dotenv";
dotenv.config();

import  app from "./src/app.js";

const port = 3000;

app.listen(port, () => {
    console.log("Servidor rodando na porta 3000")
});