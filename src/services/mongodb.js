const mongoose = require('mongoose');
const keys = require('../config/prod');

const MONGO_URI = keys.mongoURI;

if (MONGO_URI === undefined) {
  console.log('[Device Control API][Env Vars][Error]: The Mongo URI is not defined');
  process.exit(1);
}

const {capitalize} = require('../utils/capitalize');

// Mongoose connection
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, err => {
  if (err) throw err;
  console.log('[Device Control API][Mongoose] Connection to MongoDB is ready');
});

// Device Schema
const deviceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  duty: Number,
  state: Boolean,
  timerOn: String,
  timerOff: String,
  timerState: Boolean,
  deviceId: String,
  _user: mongoose.Schema.Types.ObjectId,
  alias: String,
});

const devices = mongoose.model('devices', deviceSchema);

// User Schema
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  devices: mongoose.Schema.Types.Array,
  googleID: String,
  name: String,
  lastName: String,
  email: String,
  photo: String,
});

const users = mongoose.model('users', userSchema);

/**
 * Get the user related to the device
 * @description Return the details of the user that are stored in a mongodb database
 * @param {String} deviceID ID of the device listed in IoT Core
 * @returns {object} {fullName, email and profilePic} or an empty object in case of error or missing info
 */
exports.deviceUser = async deviceID => {
  const userDevice = await devices.findOne({deviceId: deviceID});
  if (userDevice) {
    const userId = userDevice._user;
    const user = await users.findById(userId);
    if (user)
      return {
        fullName: capitalize(`${user.name} ${user.lastName}`.toLowerCase()),
        email: user.email,
        profilePic: user.photo,
      };
    else return null;
  } else {
    return null;
  }
};
