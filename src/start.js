const {deviceControlApi} = require('.');
const PORT = process.env.PORT;

if (PORT === undefined) {
  console.log('[Device Control API][Env Vars][Error]: The Port is not defined');
  process.exit(1);
}

deviceControlApi.listen(PORT);

// Start the app in the given port.
console.log(`[Device Control API] App working on port: ${PORT}`);
