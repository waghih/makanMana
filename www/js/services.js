angular.module('app.services', [])

.factory('HttpService', function($http) {
  var searchData = [];
  var restaurants = [];
  var foundRestaurants = [];
  var baseUrl = 'http://farooqezhar.com/'
  return {
    getRestaurants: function() {
      // $http returns a promise, which has a then function, 
      // which also returns a promise      
      return $http.get(baseUrl+'get.php')
        .then(function(response) {
          // In the response resp.data contains the result
          // check the console to see all of the data returned        
          // console.log('Get Restaurants', response);
          restaurants = response.data.restaurant_info;
          return response;
       }); 
    },
    getRestaurant: function(restaurantId){
      // console.log(restaurants);
      // for(var i=0;i<restaurants.length;i++){
      //   console.log(restaurants[i].id);
      //   if(restaurants[i].id == restaurantId){
      //     return restaurants[i];
      //     // console.log('Get Restaurant', restaurants[i]);
      //   }
      // }
      return $http.get(baseUrl+'getRestaurantById.php?id='+restaurantId)
      .then(function(response){
        // return response;
        console.log(response);
        return response;
      });
    },
    getRestaurantsByMeal: function(meal){
      return $http.get(baseUrl+'getRestaurantsByMeal.php?meal='+meal)
      .then(function(response){
          restaurants = response.data.result; 
          console.log(restaurants);       
          return response;
      });
    },
    getFoods: function(){
      return $http.get(baseUrl+'getAllFoods.php')
      .then(function(response){
          return response;
      });
    },
    getRestaurantReview: function(restaurantId){
      return $http.get(baseUrl+'getReview.php?id='+restaurantId)
      .then(function(response){
        // return response;
        console.log(response);
        return response;
      });
    },
    createReview:function(reviewData){
      console.log(reviewData);
      return $http.post(baseUrl+'addReview.php',reviewData,{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
          }
      });
    },
    storeSearch:function(search){
      searchData = search;
      if(searchData.state == "Any"){
        searchData.state = '';
      }
      if(searchData.city == "Any"){
        searchData.city = '';
      }
      if(searchData.meal == "Any"){
        searchData.meal = '';
      }
      if(searchData.cuisine == "Any"){
        searchData.cuisine = '';
      }
    },
    getSearchData:function(){
      return searchData;
    },
    searchRestaurant:function(searchData){
      console.log(searchData);
      return $http.post(baseUrl+'findRestaurant.php',searchData,{
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
          }
      }).then(function(response){
          console.log(response);
          foundRestaurants = response.data.result; 
          console.log(foundRestaurants);       
          return response;
      });
    },
    postFeedback:function(feedbackData){
      console.log(feedbackData);
      // return $http.post(baseUrl+'postFeedback.php',feedbackData,{
      //     headers: {
      //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
      //     }
      // });
    } 
  }
})

.service('DistanceService',function($cordovaGeolocation){
  var originLatitude;
  var originLongitude;
  var origin = (0,0);

  return{
    getLocation: function(callback) {
      var options = {timeout: 10000, enableHighAccuracy: false};

      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
               
        originLatitude = position.coords.latitude;
        originLongitude = position.coords.longitude;

        origin = new google.maps.LatLng(originLatitude,originLongitude);
              
        callback();
              
        }, function(error){
            console.log("Could not get location");
        }
      );
    },
    // calculateDistance:function(latitude,longitude,callback){

    //   var destination = new google.maps.LatLng(latitude,longitude);
    //   var request = {
    //     origin      : origin, // a city, full address, landmark etc
    //     destination : destination,
    //     travelMode  : google.maps.DirectionsTravelMode.DRIVING
    //   };

    //   var directionsService = new google.maps.DirectionsService();

    //   directionsService.route(request, function(response, status) {
    //     // console.log(status);
    //     // console.log(google.maps.DirectionsStatus.OK)
    //     if ( status == google.maps.DirectionsStatus.OK ) {
    //       distance = (response.routes[0].legs[0].distance.value)/1000;
    //       // console.log(distance);
    //       callback(distance);
    //       return distance;
    //     }
    //     else {
    //       console.log("error")
    //       // oops, there's no route between these two locations
    //       // every time this happens, a kitten dies
    //       // so please, ensure your address is formatted properly
    //     }
    //   });
    // }
    calculateDistance:function(latitude,longitude,callback){
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(latitude-originLatitude);  // deg2rad below
      var dLon = deg2rad(longitude-originLongitude); 
      var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(deg2rad(originLatitude))*Math.cos(deg2rad(latitude))*Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      callback(d);
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      return d;
    }
    // calculateSingleDistance:function(latitude,longitude){
    //   var R = 6371; // Radius of the earth in km
    //   var dLat = deg2rad(latitude-originLatitude);  // deg2rad below
    //   var dLon = deg2rad(longitude-originLongitude); 
    //   var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(deg2rad(originLatitude))*Math.cos(deg2rad(latitude))*Math.sin(dLon/2) * Math.sin(dLon/2);
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    //   var d = R * c; // Distance in km WTF IS THIS?????????
    //   function deg2rad(deg) {
    //     return deg * (Math.PI/180)
    //   }
    //   return d;
    // }    
  }
})

.service('$cordovaLaunchNavigator', ['$q', function ($q) {
    "use strict";

    var $cordovaLaunchNavigator = {};
    $cordovaLaunchNavigator.navigate = function (destination, options) {
      var q = $q.defer(),
        isRealDevice = ionic.Platform.isWebView();

      if (!isRealDevice) {
        q.reject("launchnavigator will only work on a real mobile device! It is a NATIVE app launcher.");
      } else {
        try {

          var successFn = options.successCallBack || function () {
              },
            errorFn = options.errorCallback || function () {
              },
            _successFn = function () {
              successFn();
              q.resolve();
            },
            _errorFn = function (err) {
              errorFn(err);
              q.reject(err);
            };

          options.successCallBack = _successFn;
          options.errorCallback = _errorFn;

          launchnavigator.navigate(destination, options);
        } catch (e) {
          q.reject("Exception: " + e.message);
        }
      }
      return q.promise;
    };

    return $cordovaLaunchNavigator;
  }])
