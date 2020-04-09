const googleService = require('../services/gcp');

const {updateDevice} = require('../services/firestore');

/**
 * Get the state of a iot core device.
 * @description List the last 10 states of device
 * @param {String} deviceId ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "deviceState": {
 *   "deviceStates": [
 *     {
 *       "data": {
 *         "hum": 39.917511,
 *         "temp": 30.660281
 *       },
 *       "datetime": "2020-01-30T14:35:39.750Z"
 *     },
 *     ...
 *   ]
 *  }
 * }
 */
exports.getDeviceState = async (req, res) => {
  const {id} = req.params;
  console.log('[Device Control API][getDeviceState (' + id + ')][Request]', req.params);
  try {
    // Get device state
    const deviceState = await googleService.getDeviceState(id);
    console.log('[Device Control API][getDeviceState (' + id + ')][Response] ', deviceState);
    res.status(200).json({data: deviceState});
  } catch (error) {
    console.log('[Device Control API][getDeviceState (' + id + ')][Error] ', error);
    // Send the error
    res.status(500).json({error});
  }
};

/**
 * Get the config of a iot core device.
 * @description List the last 10 configs of device
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "deviceConfig": [
 *   {
 *     "data": {
 *       "board": {
 *         "led1": {
 *           "duty": 0.35,
 *           "state": true
 *         },
 *         "led2": {
 *           "duty": 0.35,
 *           "state": true
 *         },
 *         "timer": {
 *           "timerOn": "08:00",
 *           "timerOff": "00:00",
 *           "timerState": true
 *         }
 *       }
 *     },
 *     "datetime": "03-01-2020 17:48:47"
 *   ]}
 * }
 */
exports.getDeviceConfig = async (req, res) => {
  const {id} = req.params;
  console.log('[Device Control API][getDeviceConfig (' + id + ')][Request] ', req.params);
  try {
    // Get the device config
    const deviceConfig = await googleService.getDeviceConfig(id);
    console.log('[Device Control API][getDeviceConfig (' + id + ')][Response] ', deviceConfig);
    res.status(200).json({data: deviceConfig});
  } catch (error) {
    console.log('[Device Control API][getDeviceConfig (' + id + ')][Error] ', error);
    // Send the error
    return res.status(500).json({error});
  }
};

/**
 * Update the configuration of a registered device.
 * @description Send the configuration to Google IoT Core.
 * @param {String} id - ID of the device listed in IoT Core
 * @example Request example:
 * {
 *	"device": {
 *		"deviceId": "esp8266_16CB39",
 *		"config": {
 *			"duty": 0.3,
 *			"state": true,
 *			"timerOn": "00:00",
 *			"timeOff": "12:00",
 *			"timerState": true
 *		}
 *	}
 * }
 */
exports.updateDeviceConfig = async (req, res) => {
  // Get the deviceId and config from the request body.
  const {id} = req.params;
  console.log('[Device Control API][updateDeviceConfig (' + id + ')][Request] ', req.params);
  const {device} = req.body;
  const {config} = device;

  if (config === undefined) {
    console.log('[Device Control API][updateDeviceConfig (' + id + ')][Error]: Config Undefined');
    return res.status(500);
  }
  // Send the configuration to google IoT core.
  try {
    const status = await googleService.updateDeviceConfig(id, config);
    // If configuration is ok, then update the config in the database.
    // Do not confuse the updateDeviceConfig status with the status of this controller
    if (status === 200) {
      try {
        await updateDevice(id, config);
        console.log('[Device Control API][updateDeviceConfig (' + id + ')][Response] ', {
          message: 'Config updated',
        });
        return res.status(status).sendStatus(status);
      } catch (error) {
        console.log('[iOLED-API][updateDeviceConfig][Error] ', {error: error.message});
      }
    }
  } catch (error) {
    console.log('[Device Control API][updateDeviceConfig (' + id + ')][Error] ', error);
    // Send the error
    return res.status(500).json({error});
  }
};

/**
 * Get the last state of the device
 * @description Controller that returns a JSON object with the last state saved in IoT Core
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "data": {
 *    "hum": 43.541473,
 *    "temp": 30.703181
 *  },
 *  "datetime": "2020-01-30T14:42:23.790Z"
 * }
 */
exports.getDeviceLastState = async (req, res) => {
  const {id} = req.params;
  console.log(
    '[Device Control API][getDeviceLastState (' + id + ')][Request]',
    req.params,
    req.body
  );
  // Using the same logic in the "getDeviceState" function
  try {
    const deviceState = await googleService.getDeviceState(id);
    const deviceStateResponse = Object.keys(deviceState).length === 0 ? {} : deviceState[0];
    console.log(
      '[Device Control API][getDeviceLastState (' + id + ')][Response]',
      deviceStateResponse
    );
    res.status(200).json({data: deviceStateResponse});
  } catch (error) {
    console.log('[Device Control API][getDeviceLastState (' + id + ')][Error]', error);
    // Send the error
    res.status(500).json({error});
  }
};

/**
 * Get the last config of the device
 * @description Controller that returns a JSON object with the last config saved in IoT Core
 * @param {String} id - ID of the device listed in IoT Core
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "data": {
 *    "board": {
 *      "led1": {
 *        "duty": 1,
 *        "state": true
 *      },
 *      "led2": {
 *        "duty": 1,
 *        "state": true
 *       },
 *      "timer": {
 *        "timerOn": "11:00",
 *        "timerOff": "23:00",
 *        "timerState": true
 *      }
 *    }
 *  },
 *  "datetime": "2020-01-28T19:02:32.000Z"
 * }
 */
exports.getDeviceLastConfig = async (req, res) => {
  const {id} = req.params;
  console.log(
    '[Device Control API][getDeviceLastConfig (' + id + ')][Request] ',
    req.params,
    req.body
  );
  // Using the same logic in the "getDeviceConfig" function
  try {
    const deviceConfig = await googleService.getDeviceConfig(id);
    console.log(
      '[Device Control API][getDeviceLastConfig (' + id + ')][Response] ',
      deviceConfig[0]
    );
    res.status(200).json({data: deviceConfig[0]});
  } catch (error) {
    console.log('[Device Control API][getDeviceLastConfig (' + id + ')][Error] ', error);
    // Send the error
    return res.status(500).json({error});
  }
};
