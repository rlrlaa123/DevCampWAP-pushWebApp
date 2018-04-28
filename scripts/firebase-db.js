var db = firebase.database();

function sendDeviceKeytoFirebase(key) {
  const userid = 'users/browserKey-' + getID()
  // firebase db 넣은 API
  return db.ref(userid).set({
    key: key,
    time: getCurrentTime()
  }).then(function () {
    console.log("The key has been sent to Firebase DB");
    return userid;
  }).catch(function () {
    console.error('Sending a key to server has been failed');
    return;
  });
}

function removeDeviceKeyInFirebase() {
  return db.ref().remove(
).then(function() {
    console.log("They key has been deleted from Firebase DB");
  }).catch(function(error) {
    console.error('Deleting a key to server has been failed: ' + error);
  })
}

function getID() {
  var date = new Date();
  return date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
}

function getCurrentTime() {
  return new Date().toLocaleString();
}
