module.exports = {
  apps : [{
    name: 'weather-Client',
    "script": "npm",
    "args" : "start",
    autorestart: true
  }],

  deploy : {
    production : {
      key: "/Users/gmichelant/.ssh/id_rsa",
      user : 'pi',
      host : '192.168.2.28',
      ssh_options: "StrictHostKeyChecking=no",
      ref  : 'origin/master',
      repo : 'https://GeraldM1614@bitbucket.org/gegeraptor/weather-client.git',
      path : '/home/pi/weather',
      post-deploy : 'npm install && pm2 reload ecosystem.config.js'
    }
  }
};
