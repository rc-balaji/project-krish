import socket
import threading
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO

# Initialize GPIO
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(27, GPIO.OUT)

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def server_program():
    host = get_ip_address()
    port = 5000
    server_socket = socket.socket()
    server_socket.bind((host, port))
    server_socket.listen(2)
    print(f"TCP Listening on {host}:{port}")

    while True:
        conn, address = server_socket.accept()
        print("TCP Connection from: " + str(address))
        while True:
            data = conn.recv(1024).decode()
            if not data:
                break
            print("From connected user: " + str(data))
            if data.upper() == "ON":
                GPIO.output(27, GPIO.HIGH)
                print("Light ON")
            elif data.upper() == "OFF":
                GPIO.output(27, GPIO.LOW)
                print("Light OFF")
            conn.send(data.encode())
        conn.close()

def on_connect(client, userdata, flags, reason_code, properties):
    print(f"MQTT Connected with result code {reason_code}")
    client.subscribe("kristec")

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload.decode("utf-8")))
    message = msg.payload.decode("utf-8")
    if message.upper() == "ON":
        GPIO.output(27, GPIO.HIGH)
        print("Light ON")
    elif message.upper() == "OFF":
        GPIO.output(27, GPIO.LOW)
        print("Light OFF")

def mqtt_client_program():
    mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    mqttc.on_connect = on_connect
    mqttc.on_message = on_message

    mqttc.connect("mqtt.eclipseprojects.io", 1883, 60)
    mqttc.loop_start()

if __name__ == '__main__':
    try:
        tcp_thread = threading.Thread(target=server_program)
        mqtt_thread = threading.Thread(target=mqtt_client_program)

        tcp_thread.start()
        mqtt_thread.start()

        tcp_thread.join()
        mqtt_thread.join()
    except KeyboardInterrupt:
        print("\nProgram terminated!")
    finally:
        GPIO.cleanup()
        print("GPIO Cleaned up")
