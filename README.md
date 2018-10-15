## Synopsis

This application is part of a project involving Raspberry Pi to build a Weather Station. What differentiate this project from others is the setup that separates clearly front end and backend to provide modularity. The whole project is based on javascript.

## Description of the main project
The Project is a mix of technologies to provide on a screen information collected by weather sensors and data coming from public API. Because there was space left on the screen and it brings a nice touch, I added a slideshow of pictures located on a USB stick.

## Technologies used
The idea here was to bring modularity not only in the way software is built ( so we can easily add new features) but also in order to be able to bring more devices to cover additional rooms or possibilities. I thus decided to build a back-end with Node JS on a raspberry pi 3 Model B communicating with a raspberry pi zero connected to sensors. I am using MQTT as a Message Queue to send data received from sensors to the backend and Socket.io to update the information presented to the user Interface. in fact, the raspberry pi zero has two roles has in addition to collect data form sensor and ship them to the back end, it also receive from the backend the presentation layer built on vueJS and served to the browser of the RPi Zero where the screen is also connected.

## diagram of the solution
![diagram](/diagram-weather.jpg)

## Components used

**front end and sensors**

* Raspberry pi Zero w
* Adafruit BME280 sensor – connected by i2c 
* HC-SR501 PIR motion sensor – connected on GPIO 23
* Old VGA monitor (with HDMI to VGA adaptor)
* Button (not used)– connected on GPIO 25 

**Backend**

* Raspberry pi 3 model B
* USB stick


## Motivation

This project is my first RPI project butI wanted to consolidate in a single project information I only found in many disparate sources of information. there is nothing fancy here but it exposes and integrate the result of many interesting concepts and technologies combined




#the weather station application#

 A very basic nodeJs application that captures data coming from an adafruit BME280 (temperature, Pressure and humidity). the data is collected and transmitted every time somebody is entering the room where the captor is. At the same time, the RPI powers on the monitor whose browser is connected to the UI served by the backend. after 2 minutes, the monitor is switched off. I will not describe how the sensors are connected as it is very well documented and i did not create anything fancy here. the only adjustment I had to do was regarding the BME280 which tends to add a few degrees to the temperature and needs to be adjusted for the pressure.  so i am adding and removing a few units from the data i collect before sending them to the back end

## Installation

you can pull the project and run npm install to install all dependancies. then, here is the line to start the app
Because of the GPIO library you need to use SUDO to run the app so, 

> 'sudo node -r dotenv/config  index.js'

In order to facilitate deployment I created a weatherClient.json file that points to Npm start script so i can use PM2 easily. 

> sudo PM2 start weatherClient.json

## deploy on RPI
there are many tutorials on how to run node js on RPI, so I will not do it here but I recommend to use PM2. [PM2]:(http://pm2.keymetrics.io/) is a node.js process manager that bring s a lot of nice features but mainly brings you the capability to restart your app if something goes wrong.

##Challenges##
no real challenges to capture data and send them through MQTT, but it is messy to connect a monitor to the raspberry pi and get Chromium Browser to work correctly. once again, I took those recipes form Google, but wanted to share to avoid you having to look at many places.
the first thing was regarding how you can open Chromium browser on the start of the RPI.
this can be done by editing the following application:

> nano ~/.config/lxsession/LXDE-pi/autostart

 

    @lxpanel --profile LXDE-pi
    @pcmanfm --desktop --profile LXDE-pi
    #@xscreensaver -no-splash
    @point-rpi
    @xset s noblank
    @xset s off
    @xset -dpms
    @sh /home/pi/start.sh
    @chromium-browser --kiosk --start-maximized --incognito  192.168.2.25:3000


the issue is that sometimes, Chromium is throwing an error message (when the RPI did not close properly the browser displays a message to restore pages on reboot) or an invitation to translate the page and the message stays on the screen. the only clear answer i got to address that was to follow those instructions (http://martinpennock.com/blog/disable-restore-session-bubble-chromium-raspberry-pi/)


## References

Here are the links to the other applications that are part of the project:

* the UI version 2: [bitbucket](https://bitbucket.org/gegeraptor/weather-ui-v2/src)
* User Interface : [bitbucket](https://bitbucket.org/gegeraptor/weather-ui/src/master/)
* client node.js app running on the RPI zero : [bitbucket](https://bitbucket.org/gegeraptor/weather-client/src/master/)
* Backend : [bitbucket](https://bitbucket.org/gegeraptor/weather-server/src/master/)



## Contributors

Gerald Michelant

## License
You can do whatever you want with this code and learn to have fun with Node js, Vue Js, Raspberry pi...