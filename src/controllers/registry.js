const googleService = require('../services/gcp');

/**
 * List all the registries in IoT Core
 * @description Controller that returns a JSON object with all the registries available in the IoT Core project.
 * @param {} req Doesn't need any parameters
 * @returns {object} HTTP status code - 200, 500.
 * @example Response example:
 * {
 *  "registries": [
 *    "reg-devices"
 *  ]
 * }
 */
exports.getRegistries = async (req, res) => {
  console.log('[Device Control API][GetRegistries][Request] ', req.params, req.body);
  try {
    // Get registries from the current project
    const registries = await googleService.getRegistries();
    console.log('[Device Control API][GetRegistries][Response] ', registries);
    res.status(200).json({registries});
  } catch (error) {
    console.log('[Device Control API][GetRegistries][Error] ', err);
    // Send the error
    return res.status(500).json({error});
  }
};
