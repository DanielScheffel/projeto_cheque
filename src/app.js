import express from "express";
import cors from "cors";
import pool from "./database/database.js";
import authRouter from "./routes/authRoutes.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use("/", authRouter);


app.get("/", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "Api EcoCheque rodando..."
    });
});

app.get("/db", async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM gerencia");
    res.json(rows)

})

export default app;