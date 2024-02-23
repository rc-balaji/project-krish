import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

# Set up GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM) # Use Broadcom pin-numbering scheme
GPIO.setup(27, GPIO.OUT) # Set pin 27 to be an output pin

def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")
    client.subscribe("kristec")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload.decode("utf-8")))
    message = msg.payload.decode("utf-8")
    
    # Control GPIO based on the received message
    if message == "ON":
        GPIO.output(27, GPIO.HIGH) # Turn on
        print("Light ON")
    elif message == "OFF":
        GPIO.output(27, GPIO.LOW) # Turn off
        print("Light OFF")

mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
mqttc.on_connect = on_connect
mqttc.on_message = on_message

mqttc.connect("mqtt.eclipseprojects.io", 1883, 60)
mqttc.loop_forever()

# Clean up GPIO when the program is terminated
try:
    mqttc.loop_forever()
except KeyboardInterrupt:
    GPIO.cleanup() # Clean up GPIO to ensure a clean exit
