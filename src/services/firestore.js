const Firestore = require('@google-cloud/firestore');
const {PROJECT_ID} = require('../config/env');

const db = new Firestore({
  projectId: PROJECT_ID,
});

const devicesRef = db.collection('devices');

const usersRef = db.collection('users');

exports.getDevicesWithUserInfo = async () => {
  try {
    const snapshot = await devicesRef.get();
    const data = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {deviceID: data.deviceID, user: data.user};
    });
    for (let index = 0; index < data.length; index++) {
      const device = data[index];
      const userId = device.user;
      console.log('USER ID:', userId);
      if (userId !== '') {
        const doc = await usersRef.doc(userId).get();
        const userInfo = doc.data();
        device.user = {
          name: capitalize(`${userInfo.name} ${userInfo.lastName}`),
          email: userInfo.email,
          photo: userInfo.photo,
        };
      } else {
        device.user = null;
      }
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUserByDevice = async (id) => {
  try {
    const snapshot = await devicesRef.doc(id).get();
    const device = snapshot.data();
    const userId = device.user;
    const doc = await usersRef.doc(userId).get();
    const userInfo = doc.data();
    return {
      name: capitalize(`${userInfo.name} ${userInfo.lastName}`),
      email: userInfo.email,
      photo: userInfo.photo,
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @CristianValdivia
 * Update the config of device
 * @description Update config of device in Firestore
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {Function} next Callback function
 */
exports.updateDeviceDB = async (id, config) => {
  try {
    await devicesRef
      .where('deviceID', '==', id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          devicesRef.doc(doc.id).update(config);
        });
      });
    console.log('[Firestore Service] [updateDeviceDB] Update config:', config);
  } catch (error) {
    console.log(
      '[Firestore Service] [updateDeviceDB] [Error] There was an error update config',
      error
    );
    throw new Error(error);
  }
};
