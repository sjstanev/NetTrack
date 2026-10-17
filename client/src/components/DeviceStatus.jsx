import { useState } from 'react';

export default function DeviceStatus() {
    const [deviceStatus, setDeviceStatus] = useState('online');

    function toggleStatus() {
        setDeviceStatus(currentStatus =>
            currentStatus === 'online' ? 'offline' : 'online'
        );
    }

    return (
        <>
            <p>Device Status: {deviceStatus}</p>

            <button onClick={toggleStatus}>
                {deviceStatus === 'online' ? 'Set Offline' : 'Set Online'}
            </button>
        </>
    );
}