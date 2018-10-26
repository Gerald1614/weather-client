module.exports = {
  apps : [{
    name: 'app',
    script: 'index.js',
    autorestart: true
  }],

  deploy : {
    production : {
      key: "$HOME/.ssh",
      user : 'pi',
      host : '192.168.2.28',
      ref  : 'origin/master',
      repo : 'git@bitbucket.org:gegeraptor/weather-client.git',
      path : '/home/pi/weather',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
