## Synopsis

This application is part of a project involving Raspberry Pi to build a Weather Station. What differnetiate this project for other is the setup that seperate clearly front end and backend to provide modularity. The whole project is base don javascript.

## description of the main project
The Project is amix of technologies to provide on a screen information collected by weather sensors and data coming from public API. Becasue there was space left on the screen and it brings a nice touch, I added a slideshow of pictures located on a USB stick.

## Technologies used
The idea here was to bring modularity not only in teh way software is built ( so we cna easily add new features) but also in order to be able to bring more devices to cover additional rooms or possibilities. I thus decided to build a back-end with Node JS on a raspberry pi 3 Model B communicating with a raspberry pi zero connected to sensors. I am using MQTT as a MEssage Queue to send data received from sensors to the backend and Socket io to update the infrmation presented to the user Interface. in fact, the raspberry pi zero has two roles has in addition to collect data form sensor and ship them to the back end, it also receive from the backend the presentation layer built on vueJS and served to the browser of the RPi Zero where the screen is also connected.

## diagram of the solution
![diagram](/diagram-weather.jpeg)

## Components used

**front end and sensors**
Raspberry pi Zero w
Adafruit BME280 sensor – connected by i2c 
HC-SR501 PIR motion sensor – connected on GPIO 23
Hold VGA monitor (with HDMI to VGA adaptor)
Button (not used)– connected on GPIO 25 

**Backend**
Raspberry pi 3 model B
USB stick


## Motivation

Thsi project is my frist RPI project butI wanted to consolidate in a single project information I only found in many disparate sources of information. there is nothign fancy here but it exposes and integrate the result of many interesting concepts and technologies combined

#the weatherstation application#
 A very basic nodeJs application that captures data coming from an adafruit BME280 (temperature, Pressure and humidity). the data is collected and trasnmetted every time somebody is entering the room where the captor is. At the same time, the RPI powers on the monitor whose browser is conencted to the UI served by the backend. after 2 minutes, the monitor is switched off. I will not describe how the sensors are connected as it is very well documented and i did not create anything fancy here. the only adjustement I had to do was regarding the BME280 which tends to add a few degrees to the temperature and needs to be adjusted for the pressure.  so i am adding and removing a few units from the data i collect before sending them to the back end

## Installation

you can pull the project and run npm install to install all dependancies. then, here is the line to start the app, of course, I also added in the package.json so the app can be started by 'npm run start'
But because of the GPIO library you need to use SUDO to run the app so, 'sudo node index.js'

## deploy on RPI
there are many tutorials on how to run node js on RPI, so I will not do it here but I recommend to use PM2. [PM2]:(http://pm2.keymetrics.io/) is a node.js process manager that bring s a lot of nice features but mainly brings you the capability to restart your app if somethign goes wrong.

##Challenges##
no real challenges to capture data and send them through MQTT, but it is messy to conenct a monitor to the raspberry pi and get Chromium Browser to work correctly. once again, I took those recipes form Google, but wanted to shar eto avoid you having to look at many places.
the first thing was regarding ho wyou can open Chromium browser on the start of teh RPI.
this can be done by editing the following applciation:

nano ~/.config/lxsession/LXDE-pi/autostart

```@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@point-rpi
@xset s noblank
@xset s off
@xset -dpms
@sh /home/pi/start.sh
@chromium-browser --kiosk --start-maximized --incognito  192.168.2.25:3000
```

the issue is that sometimes, Chromium is throwing an error message (when the RPI did not close properly teh browser displays a message to restore pages on reboot) or an onvitation to translate the page and the message stays on the screen. the only clear answer i got to address that was to follow those instructions (http://martinpennock.com/blog/disable-restore-session-bubble-chromium-raspberry-pi/)


## References

Here are the links to the other applciations that are part of the project:
* the UI : [GitHub](http://github.com)
* the node js app running on the RPI zero


## Contributors

Gerald Michelant

## License
You can do whatever you want with this code and learn to have fun with Node js, Vue Js, Raspberry pi...
