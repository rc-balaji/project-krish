import threading
import paho.mqtt.client as mqtt
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/check', methods=['GET'])
def check_ip():
    # This endpoint confirms availability. You might want to implement actual checks or logic as needed.
    return jsonify({"message": "IP Available"}), 200

@app.route('/publish', methods=['POST'])
def publish_command():
    data = request.json
    status = data.get('status')
    print(f"Received status: {status}")
    # Here, you might trigger some hardware action or another service if GPIO was being used.
    return jsonify({"message": "Status updated"}), 200

def flask_app():
    app.run(host='0.0.0.0', port=8000, use_reloader=False)

def on_connect(client, userdata, flags, reason_code, properties):
    print(f"MQTT Connected with result code {reason_code}")
    client.subscribe("kristec")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload.decode("utf-8")))
    message = msg.payload.decode("utf-8")
    print(f"MQTT Message received: {message}")
    # Here, you might handle the message, similar to handling the status in the Flask app.

def mqtt_client_program():
    mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqttc.on_connect = on_connect
    mqttc.on_message = on_message

    mqttc.connect("mqtt.eclipseprojects.io", 1883, 60)
    mqttc.loop_start()

if __name__ == '__main__':
    try:
        flask_thread = threading.Thread(target=flask_app)
        mqtt_thread = threading.Thread(target=mqtt_client_program)

        flask_thread.start()
        mqtt_thread.start()

        flask_thread.join()
        mqtt_thread.join()
    except KeyboardInterrupt:
        print("\nProgram terminated!")
