const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // Make sure this port is different from the React app port

app.use(cors());
app.use(bodyParser.json());

const mqttClient = mqtt.connect("mqtt://mqtt.eclipseprojects.io:1883");

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
});

app.post('/publish', (req, res) => {
    const { status } = req.body; // Assuming the body contains { "status": "ON" } or { "status": "OFF" }
    const payload = JSON.stringify({ text: status });

    mqttClient.publish('kristec', payload, { qos: 1 }, (error) => {
        if (error) {
            console.error('Publish error:', error);
            res.status(500).send('Publish error');
        } else {
            console.log('Message sent:', payload);
            res.send('Message sent');
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
