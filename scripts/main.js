/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';
// import firebase from "./firebase-db.js";

var pushButton = document.querySelector('.js-push-btn');
let isSubscribed = false;
// 등록된 서비스워커 객체
let swRegistration = null;
let userid = '';


if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then(function(swReg) {
      console.log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initialiseUI();
    })
    .catch(function(error) {
      console.error('Service Worker Error', error);
    });
};

// 화면 UI 초기화 및 Push 등록 여부 확인
function initialiseUI() {

  // Push 등록 여부 확인
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // 브라우저가 등록되어 있으면 firebase에서 삭제
      unSubscribeUser();
    } else {
      // 브라우저가 등록되어 있지 않으면 유저를 firebase에 등록
      subscribeUser();
    }
  });

  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

// 브라우저를 Push 서버에 등록하는 메서드
function subscribeUser() {
  swRegistration.pushManager.subscribe({
    // 푸시 수신 시 알람 표시 속성
    userVisibleOnly: true
  })
  .then(function(subscription) {
    console.log('User is subscribed:', subscription);
    isSubscribed = true;
    updateSubscriptionOnServer(subscription);
    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unSubscribeUser() {
  swRegistration.pushManager.getSubscription().then(function(subscription) {
    subscription.unsubscribe().then(function(successful) {
      console.log('User is unsubscribed : ', successful);
      console.log('Unsubscribed subscription : ', subscription);

      updateSubscriptionOnServer(subscription, successful);
      isSubscribed = false;
      updateBtn();
    }).catch(function(e) {
      console.log('Failed to unsubscribe the user: ', e);
      updateBtn();
    })
  });
}

function updateSubscriptionOnServer(subscription, unsubscribed) {
  var subscriptionJson = document.querySelector('.js-subscription-json');
  var subscriptionDetails = document.querySelector('.js-subscription-details');
  if (subscription && !unsubscribed) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
    sendDeviceKeytoFirebase(subscription.endpoint.split('send/')[1]).then(function(result) {
      userid = result;
    });
  } else {
    console.log(unsubscribed);
    console.log(userid);
    subscriptionDetails.classList.add('is-invisible');
    removeDeviceKeyInFirebase(userid);
  }
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}