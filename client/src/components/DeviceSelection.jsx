import { useState } from 'react';
import { data } from '../db/data.js';

export default function DeviceSelection() {
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    function handleSelectDevice(id) {
        setSelectedDeviceId(id);
    }

    const selectedDevice = data.find(
        device => device.id === selectedDeviceId
    );

    return (
        <>
            <ul>
                {data.map(device => (
                    <li key={device.id}>
                        <p>
                            <b>{device.hostname}</b>
                            {': ' + device.ipAddress}
                        </p>

                        <button
                            onClick={() => handleSelectDevice(device.id)}
                        >
                            Select
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Selected Device</h3>

            {selectedDevice ? (
                <p>
                    <b>{selectedDevice.hostname}</b>
                    {': ' + selectedDevice.ipAddress}
                    {' ' + selectedDevice.vendor}
                </p>
            ) : (
                <p>No device selected</p>
            )}
        </>
    );
}