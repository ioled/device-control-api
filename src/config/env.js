const PROJECT_ID = process.env.PROJECT_ID;
if (PROJECT_ID === undefined) {
  console.log(
    '[Device Control API][Error] No Google Cloud Project Identifier specified in the env variables'
  );
}

module.exports = {
  PROJECT_ID,
};
