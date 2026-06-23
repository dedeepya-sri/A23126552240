require("dotenv").config();

const express = require("express");

const runScheduler =
require("./scheduler");

const { Log } =
require("../logging-middleware/logger");

const app = express();

app.get(
    "/schedule",
    async (req, res) => {

        try {

            await Log(
                "backend",
                "info",
                "route",
                "Schedule API called"
            );

            const result =
                await runScheduler();

            res.json(result);

        }
        catch (error) {

            await Log(
                "backend",
                "error",
                "handler",
                error.message
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);

app.listen(3000, async () => {

    await Log(
        "backend",
        "info",
        "config",
        "Server started"
    );

    console.log(
        "Server running on port 3000"
    );
});