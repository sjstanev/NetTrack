import express from "express";

import { devices } from "./data.js";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "NetTrack API is running",
    });
});

app.get("/api/devices", (req, res) => {
    const { status } = req.query;

    let filteredDevices = devices;

    if (status) {
        filteredDevices = devices.filter((device) => device.status === status);
    }

    res.json({
        status: "OK",
        data: filteredDevices,
    });
});

app.post("/api/devices", (req, res) => {
    const { hostname, ipAddress, vendor, model, status } = req.body;

    const requiredFields = [hostname, ipAddress, vendor, model, status];
    const allowedStatuses = ["online", "offline"];

    const hasInvalidField = requiredFields.some(
        (field) => typeof field !== "string" || field.trim() === "",
    );

    if (hasInvalidField) {
        return res.status(400).json({
            status: "error",
            message: "Missing or invalid required fields",
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid status",
        });
    }

    const id = devices.length + 1;

    const newDevice = {
        id,
        hostname,
        ipAddress,
        vendor,
        model,
        status,
    };

    devices.push(newDevice);

    return res.status(201).json({
        status: "OK",
        data: newDevice,
    });
});

export default app;
