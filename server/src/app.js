import express from "express";

import { devices } from "./data.js";

const app = express();

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "NetTrack API is running",
    });
});

app.get("/api/devices", (req, res) => {
    const { status } = req.query;
    let filteredDevices;

    if (status) {
        filteredDevices = devices.filter((device) => {
            return device.status === status;
        });
    } else {
        filteredDevices = devices;
    }
    res.json({
        status: "OK",
        data: filteredDevices,
    });
});

app.get("/api/devices/:id", (req, res) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
        return res
            .status(400)
            .json({ status: "error", message: "Invalid device ID" });
    }

    const deviceId = parseInt(id, 10);

    const foundDevice = devices.find((device) => {
        return device.id === deviceId;
    });

    if (foundDevice) {
        res.json({
            status: "OK",
            data: foundDevice,
        });
    } else {
        return res.status(404).json({
            status: "error",
            message: "Device not found",
        });
    }
});

export default app;
