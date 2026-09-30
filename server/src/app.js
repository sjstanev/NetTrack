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
        filteredDevices = devices.filter(
            (device) => device.status === status,
        );
    }

    res.json({
        status: "OK",
        data: filteredDevices,
    });
});

app.get("/api/devices/:id", (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid device ID",
        });
    }

    const deviceId = parseInt(id, 10);

    const foundDevice = devices.find(
        (device) => device.id === deviceId,
    );

    if (!foundDevice) {
        return res.status(404).json({
            status: "error",
            message: "Device not found",
        });
    }

    res.json({
        status: "OK",
        data: foundDevice,
    });
});

app.post("/api/devices", (req, res) => {
    const { hostname, ipAddress, vendor, model, status } = req.body;

    if (!hostname || !ipAddress || !vendor || !model || !status) {
        return res.status(400).json({
            status: "error",
            message: "Missing required fields",
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

    res.status(201).json({
        status: "OK",
        data: newDevice,
    });
});

export default app;