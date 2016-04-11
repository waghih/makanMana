angular.module('app.services', [])

.factory('HttpService', function($http) {
  var restaurants = []
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
      for(var i=0;i<restaurants.length;i++){
        if(restaurants[i].id == restaurantId){
          return restaurants[i];
          console.log('Get Restaurant', restaurants[i]);
        }
      }
    },
    getRestaurantReview: function(restaurantId){
        return $http.get(baseUrl+'getReview.php?id='+restaurantId)
        .then(function(response){
          // return response;
          console.log(response);
          return response;
        });
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
      callback((d*1.6));
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      return d;
    },
    calculateSingleDistance:function(latitude,longitude){
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(latitude-originLatitude);  // deg2rad below
      var dLon = deg2rad(longitude-originLongitude); 
      var a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(deg2rad(originLatitude))*Math.cos(deg2rad(latitude))*Math.sin(dLon/2) * Math.sin(dLon/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = (R * c)*1.6; // Distance in km
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }
      return d;
    }
  }
})