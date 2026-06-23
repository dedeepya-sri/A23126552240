require("dotenv").config();

const axios = require("axios");

const ACCESS_TOKEN = process.env.ACCESS_TOKEN.trim();
const LOG_API_URL = process.env.LOG_API_URL.trim();

async function Log(stack, level, pkg, message) {
    try {
        console.log("URL =", LOG_API_URL);
        console.log(
            "AUTH HEADER =",
            `Bearer ${ACCESS_TOKEN.substring(0,20)}...`
        );
        const response = await axios.post(
            LOG_API_URL,
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    }
    catch(error) {
        console.error("Logging failed");

        if(error.response) {
            console.error(error.response.data);
        }

        return null;
    }
}
console.log("TOKEN LENGTH =", ACCESS_TOKEN.length);
module.exports = { Log };