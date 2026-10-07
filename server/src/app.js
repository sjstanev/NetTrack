import express from "express";

import { devices } from "./data.js";

const app = express();

const allowedStatuses = ["online", "offline"];

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

    if (!validateRequiredFields(requiredFields)) {
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

app.put("/api/devices/:id", (req, res) => {
    let id = req.params.id;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid device ID",
        });
    }

    id = Number(id);

    const { hostname, ipAddress, vendor, model, status } = req.body;

    const requiredFields = [hostname, ipAddress, vendor, model, status];

    if (!validateRequiredFields(requiredFields)) {
        return res.status(400).json({
            status: "error",
            message: "Missing or invalid required fields",
        });
    }

    for (let device of devices) {
        if (device.id === id) {
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid status",
                });
            }

            const idx = devices.indexOf(device);
            const newDevice = {
                id,
                hostname,
                ipAddress,
                vendor,
                model,
                status,
            };
            devices.splice(idx, 1, newDevice);
            return res.status(200).json({
                status: "OK",
                message: newDevice,
            });
        }
    }
    return res.status(404).json({
        status: "error",
        message: "Device not found",
    });
});

function validateRequiredFields(requiredFields) {
    return requiredFields.every(
        (field) => typeof field === "string" && field.trim() !== "",
    );
}

export default app;
