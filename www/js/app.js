// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {
  "use strict";

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'templates/home.html'
  })
  .state('restaurant',{
    url:'/restaurant',
    templateUrl: 'templates/restaurant.html'
  })
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html'
  });
  $urlRouterProvider.otherwise('/');
})

.controller('AppCtrl',function($scope){
  $scope.restaurants = [
    {
      name: 'DLaman',
      rating: '4.3',
      distance: '3.3km'
    },
    {
      name: 'Purnamah',
      rating: '4.0',
      distance: '3.8km'
    },
    {
      name: 'KFC',
      rating: '4.6',
      distance: '5.2km'
    },
    {
      name: 'Pops',
      rating: '4.7',
      distance: '10.6km'
    },
    {
      name: 'Simply Western',
      rating: '4.1',
      distance: '23.3km'
    },
    {
      name: 'Bangi kopitiam',
      rating: '4.3',
      distance: '15.2km'
    },
    {
      name: 'Santai',
      rating: '3.9',
      distance: '7.6km'
    },
    {
      name: 'Uniq',
      rating: '3.8',
      distance: '1.2km'
    }
  ];

  $scope.items = [
    { id: 1 },
   { id: 2 },
   { id: 3 },
   { id: 4 },
   { id: 5 },
   { id: 6 },
   { id: 7 },
   { id: 8 },
   { id: 9 },
   { id: 10 }
  ];
})

// .controller('MapController', function($scope, $ionicLoading) {
 
//     google.maps.event.addDomListener(window, 'load', function() {
//         var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
//         var mapOptions = {
//             center: myLatlng,
//             zoom: 16,
//             mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
 
//         var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
//         navigator.geolocation.getCurrentPosition(function(pos) {
//             map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//             var myLocation = new google.maps.Marker({
//                 position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
//                 map: map,
//                 title: "My Location"
//             });
//         });
 
//         $scope.map = map;
//     });
 
// })

// .config(function(uiGmapGoogleMapApiProvider) {
//     uiGmapGoogleMapApiProvider.configure({
//         //    key: 'your api key',
//         v: '3.20', //defaults to latest 3.X anyhow
//         libraries: 'weather,geometry,visualization'
//     });
// })

.controller('mainCtrl', function($scope) {
        $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
        $scope.options = {scrollwheel: false};
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
