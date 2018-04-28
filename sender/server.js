var request = require('request');

// firebase 프로젝트 server key
var serverKey = "key=" + "AAAAhjD23O8:APA91bF5c_wkLQM6d3o58MSiCWeh_z0k3MtRCg9nDOe_FTSmNKGswUyIdobA0wU4DYwJidTUt2W6brpsbeOoj3ZLt6bLd7hOYkIMdU3XWG3hDr4CeOoarPrldpEuBN2l31Rph0LPd7Gc";
var deviceKey = "eCng5ITgL7s:APA91bG5yCEVijDeIpJYJph4-bXciuwA4NTJnNwrYtAgvGwDmLlsrHTR4Mvl9jpmJOk_-emDnO4B3LmCMT3PcW1vAGlEbk0Ae1Q8rXFlWyvqAbupaA9T3l7q3CELglsAH-bUWNbKe9f6";

sendMessageToUser(serverKey, deviceKey);

function sendMessageToUser(serverKey, deviceKey, message) {
  request({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type' :' application/json',
      'Authorization': serverKey,
    },
    body: JSON.stringify(
      {
        "registration_ids": [
          deviceKey
        ]
      }
    )
  }, function(error, response, body) {
    console.log("Result Log - ", body);
    if (error) {
      console.error(error, response, body);
    } else if (response.statusCode >= 400) {
      console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
    } else {
      console.log('Done!');
    }
  });
};
