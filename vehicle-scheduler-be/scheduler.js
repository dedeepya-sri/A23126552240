require("dotenv").config();

const axios = require("axios");

const optimizeTasks = require("./taskOptimizer");

const { Log } =
require("../logging-middleware/logger");

async function runScheduler() {

    try {

        await Log(
            "backend",
            "info",
            "service",
            "Fetching depots"
        );

        const depotsResponse =
            await axios.get(
                process.env.DEPOTS_API,
                {
                    headers: {
                        Authorization:
                        `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }
            );

        await Log(
            "backend",
            "info",
            "service",
            "Fetching vehicles"
        );

        const vehiclesResponse =
            await axios.get(
                process.env.VEHICLES_API,
                {
                    headers: {
                        Authorization:
                        `Bearer ${process.env.ACCESS_TOKEN}`
                    }
                }
            );

        const depots =
            depotsResponse.data.depots;

        const vehicles =
            vehiclesResponse.data.vehicles;

        const result = [];

        for (const depot of depots) {

            await Log(
                "backend",
                "debug",
                "service",
                `Optimizing depot ${depot.ID}`
            );

            const optimized =
                optimizeTasks(
                    vehicles,
                    depot.MechanicHours
                );

            result.push({

                depotID:
                depot.ID,

                mechanicHours:
                depot.MechanicHours,

                totalImpact:
                optimized.totalImpact,

                selectedTasks:
                optimized.selectedTasks
                    .map(task => task.TaskID)
            });
        }

        return result;

    }
    catch (error) {

        await Log(
            "backend",
            "error",
            "service",
            error.message
        );

        throw error;
    }
}

module.exports = runScheduler;