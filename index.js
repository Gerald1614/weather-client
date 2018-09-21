const Gpio = require('pigpio').Gpio;
const exec = require('child_process').exec;
const mqttAddress = 'mqtt://192.168.2.25';
let toggleMonitor =  false;
let togglePage = false;
const Button = new Gpio(25, {
	mode: Gpio.INPUT,
	pullUpDown: Gpio.PUD_UP,
	alert: true
  });
  
const PIRSENSOR = new Gpio(23, {
	mode: Gpio.INPUT,
	alert: true
  });
  
const BME280 = require('bme280-sensor');
const mqtt = require('mqtt');
const mqttClient = mqtt.connect(mqttAddress);
// The BME280 constructor options are optional.
// 
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
};
  
const bme280 = new BME280(options);

// Read BME280 sensor data, repeat
//
const readSensorData = () => {
  bme280.readSensorData()
    .then((data) => {
      // temperature_C, pressure_hPa, and humidity are returned by default. 
      data.timing = new Date;
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
      mqttClient.publish('tempSensor', JSON.stringify(data, null, 2), {qos:2});     
      setTimeout(readSensorData, 10000);
      })
    .catch((err) => {
      console.log(`BME280 read error: ${err}`);
      setTimeout(readSensorData, 2000);
    });
};

// Initialize the BME280 sensor
//
bme280.init()
  .then(() => {
    console.log('BME280 initialization succeeded');
    readSensorData();
  })
  .catch((err) => console.error(`BME280 initialization failed: ${err} `));

function MonitorOff() {
	setTimeout(function() {
	  child = exec('vcgencmd display_power 0',
    (error, stdout, stderr) => {
      if (error !== null) {
        console.log(`exec error: ${error}`);
      };
    toggleMonitor = false;
    console.log(`Monitor on : ${toggleMonitor}`);
    });
	}, 10000);
}

PIRSENSOR.on('alert', (level) => {
	if (!toggleMonitor) {
	  child = exec('vcgencmd display_power 1',
    	(error, stdout, stderr) => {
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
	    });
	MonitorOff();
  toggleMonitor = true; 
  togglePage = false;
	console.log(`Monitor on : ${toggleMonitor}`);
	};
});

Button.on('alert', (level) => {
  togglePage = !togglePage;
  mqttClient.publish('pageBtn', togglePage);     
  console.log(togglePage);
});