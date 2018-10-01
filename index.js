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
  let transferData = [];
  
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

      data.pressure_hPa = data.pressure_hPa.toFixed(2);
      data.humidity = data.humidity.toFixed(2);
      data.timing = new Date();
      transferData.unshift(data)
      if (transferData.length >5) {
        transferData.pop();
      }
      console.log(`data = ${JSON.stringify(transferData)}`);
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
        mqttClient.publish('MonitorOn', String(toggleMonitor));
        console.log(`Monitor on : ${toggleMonitor}`);
    });
	}, 15000);
}

PIRSENSOR.on('alert', (level) => {
	if (!toggleMonitor) {
	  child = exec('vcgencmd display_power 1',
    	(error, stdout, stderr) => {
        if (error !== null) {
          console.log(`exec error: ${error}`);
          return
        }
         MonitorOff();
          mqttClient.publish('tempSensor', JSON.stringify(transferData));     
          toggleMonitor = true; 
          mqttClient.publish('MonitorOn', String(toggleMonitor));  
          togglePage = false;
          console.log(`Monitor on : ${toggleMonitor}`);
      });
  // child = exec('sh refresh-chromium.sh',
  // (error, stdout, stderr) => {
  //     console.log(`${stdout}`);
  //     console.log(`${stderr}`);
  //     if (error !== null) {
  //         console.log(`exec error: ${error}`);
  //     }
  // });
  
	};
});
Button.glitchFilter(10000);

Button.on('alert', (level, tick) => {
  if (level) {
    togglePage = !togglePage;
    mqttClient.publish('pageBtn', String(togglePage));     
    console.log(togglePage);
  }
});