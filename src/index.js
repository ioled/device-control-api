const express = require('express');
const expressConfig = require('./config/express');
const PORT = process.env.PORT || 5000;
const cors = require('cors')({
  origin: true,
});

// Create the express app and load all middlewares and configurations.
const app = express();

app.use(cors);
expressConfig(app);

// Start the app in the given port.
app.listen(PORT);

console.log(`App working on port: ${PORT}`);
