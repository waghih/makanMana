// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.controller('AppCtrl',function($scope, HttpService, $ionicLoading, DistanceService){

  $scope.items = [];
  $ionicLoading.show({
    template: 'Loading...'
  });
  
  HttpService.getRestaurants().then(function(response) {
      $scope.items = response.data.restaurant_info;
      console.log(response.data.restaurant_info);
      $ionicLoading.hide();
      calculateDistance();
      console.log($scope.items);
  });

  var calculateDistance = function() {
    for(var i=0; i<$scope.items.length; i++ ){
      $scope.items[i].distance = "calculating...";

      (function(i) {
        // setTimeout(function() {
          DistanceService.calculateDistance($scope.items[i].latitude, $scope.items[i].longitude,
            (function(item){
              return function(distance){
                item.distance = distance + " km";
                // item.distance = "";
              }
            })($scope.items[i])
          );
        // }, i*100);
      })(i)
        // $scope.items[i].distance = DistanceService.calculateDistance($scope.items[i].latitude,$scope.items[i].longitude);
        // console.log(DistanceService.calculateDistance($scope.items[i].latitude,$scope.items[i].longitude));
    }
  }
  // $scope.items = restaurants;
})

.controller('RestaurantCtrl', function($scope, $stateParams, HttpService, $http, $cordovaGeolocation) {
  
  $scope.restaurantId = $stateParams.restaurantId;
  $scope.restaurant = HttpService.getRestaurant($scope.restaurantId);
  console.log($scope.restaurantId);
  // var distance;
  // var options = {timeout: 10000, enableHighAccuracy: true};
 
    var destination = new google.maps.LatLng($scope.restaurant.latitude, $scope.restaurant.longitude);
 
    var mapOptions = {
      center: destination,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

  //   var directionsService = new google.maps.DirectionsService();
    
  //   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
  //   var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
  //   console.log(position.coords.latitude, position.coords.longitude)
    
  //   var request = {
  //     origin      : origin, // a city, full address, landmark etc
  //     destination : destination,
  //     travelMode  : google.maps.DirectionsTravelMode.DRIVING
  //   };

  //   directionsService.route(request, function(response, status) {
  //     if ( status == google.maps.DirectionsStatus.OK ) {
  //       distance = (response.routes[0].legs[0].distance.value)/1000;
  //       alert("Distance: "+distance+" km"); // the distance in metres
  //     }
  //     else {
  //       // oops, there's no route between these two locations
  //       // every time this happens, a kitten dies
  //       // so please, ensure your address is formatted properly
  //     }
  //   });
 
  //   }, function(error){
  //     console.log("Could not get location");
  //   });
    
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: destination
      });      
     
    });   

})

.config(function($stateProvider, $urlRouterProvider) {
  "use strict";

  $stateProvider
  .state('home', {
    cache: false,
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'AppCtrl'
  })
  .state('restaurant',{
    url:'/restaurant/:restaurantId',
    templateUrl: 'templates/restaurant.html',
    controller: 'RestaurantCtrl'
  })
  .state('search', {
    url: '/search',
    templateUrl: 'templates/search.html'
  });
  $urlRouterProvider.otherwise('/');
})

.service('HttpService', function($http) {
  var restaurants = []
  return {
    getRestaurants: function() {
      // $http returns a promise, which has a then function, 
      // which also returns a promise      
      return $http.get('http://farooqezhar.com/get.php')
        .then(function(response) {
          // In the response resp.data contains the result
          // check the console to see all of the data returned        
          // console.log('Get Restaurants', response);
          restaurants = response.data.restaurant_info;
          return response;
       }); 
    },
    getRestaurant: function(restaurantId){
      for(var i=0;i<restaurants.length;i++){
        if(restaurants[i].id == restaurantId){
          return restaurants[i];
          console.log('Get Restaurant', restaurants[i]);
        }
      }
    }    
  }
})

.service('DistanceService',function($cordovaGeolocation){
  var originLatitude;
  var originLongitude;
  var distance;
  var options = {timeout: 10000, enableHighAccuracy: true};

  return{
    ready: function() {
      return originLatitude != undefined;
    },
    setup: function() {

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
           
        originLatitude = position.coords.latitude;
        originLongitude = position.coords.longitude;
              
        console.log(position.coords.latitude, position.coords.longitude)
              
        }, function(error){
            console.log("Could not get location");
        }
      );
    },
    calculateDistance:function(latitude,longitude,callback){
      console.log("asf")
          var R = 6371; // Radius of the earth in km
          var dLat = deg2rad(latitude-originLatitude);  // deg2rad below
          var dLon = deg2rad(longitude-originLongitude); 
          var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(deg2rad(originLatitude))*Math.cos(deg2rad(latitude))*Math.sin(dLon/2) * Math.sin(dLon/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          var d = R * c; // Distance in km
          console.log(d);
          callback(d);
          function deg2rad(deg) {
            return deg * (Math.PI/180)
          }
          return d;
    }
  }
})

// .service('DistanceService', function($cordovaGeolocation){


//   var restaurants = []
//   return{
//     calculateDistance:function(item){
//       restaurants = item;
//       console.log(restaurants);
//       for(var i=0 ; i<restaurants.length ; i++){
//         var distance;
//         var options = {timeout: 10000, enableHighAccuracy: true};
       
//           var destination = new google.maps.LatLng(restaurants[i].latitude,restaurants[i].longitude);

//           var directionsService = new google.maps.DirectionsService();
          
//           $cordovaGeolocation.getCurrentPosition(options).then(function(position){
       
//           var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          
//           console.log(position.coords.latitude, position.coords.longitude)
          
//           var request = {
//             origin      : origin, // a city, full address, landmark etc
//             destination : destination,
//             travelMode  : google.maps.DirectionsTravelMode.DRIVING
//           };

//           directionsService.route(request, function(response, status) {
//             if ( status == google.maps.DirectionsStatus.OK ) {
//               restaurants[i].distance = (response.routes[0].legs[0].distance.value)/1000;
//               // alert("Distance: "+distance+" km"); // the distance in metres
//             }
//             else {
//               // oops, there's no route between these two locations
//               // every time this happens, a kitten dies
//               // so please, ensure your address is formatted properly
//             }
//           });
       
//           }, function(error){
//             console.log("Could not get location");
//           });
//       }
//       return(restaurants);
//     }
//   }
// })

// .service('DistanceService',function($cordovaGeolocation){
//   var self = this;

//   self.calculateDistance = function(item){
//     var distance;
//     var options = {timeout: 50000, enableHighAccuracy: false};

//     var destination = new google.maps.LatLng(latitude,longitude);

//     var directionsService = new google.maps.DirectionsService();
  
//     $cordovaGeolocation.getCurrentPosition(options)
//       .then(function(position){
 
//         var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
//         // console.log(position.coords.latitude, position.coords.longitude)
      
//         var request = {
//           origin      : origin, // a city, full address, landmark etc
//           destination : destination,
//           travelMode  : google.maps.DirectionsTravelMode.DRIVING
//         };

//         directionsService.route(request, function(response, status) {
//           // console.log(status);
//           // console.log(google.maps.DirectionsStatus.OK)
//           if ( status == google.maps.DirectionsStatus.OK ) {
//             distance = (response.routes[0].legs[0].distance.value)/1000;
//             // console.log(distance);
//             callback(distance);
//             return distance;
//           }
//           else {
//             console.log("error")
//             // oops, there's no route between these two locations
//             // every time this happens, a kitten dies
//             // so please, ensure your address is formatted properly
//           }
//         });
 
//       }, function(error){
//         console.log("Could not get location");
//       });
//     }

//   return self;
//   }
// )
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


.run(function($ionicPlatform, DistanceService) {
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
    DistanceService.setup();
  });
});
