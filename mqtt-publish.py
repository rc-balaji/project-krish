import paho.mqtt.client as mqtt
import json

def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")

def on_publish(client, userdata, mid, reason_code, properties):
    print("Message ID: ", mid)

mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish

mqttc.connect("mqtt.eclipseprojects.io", 1883, 60)
mqttc.loop_start()

text = input("Enter the text to publish: ")
data = {'text': text}
payload = json.dumps(data)

mqttc.publish("kristec", payload, qos=1)

mqttc.loop_stop()
mqttc.disconnect()
