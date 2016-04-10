angular.module('app.controllers', [])
  
.controller('AppCtrl',function($scope, HttpService, $ionicLoading, DistanceService){
  $scope.items = [];

  $ionicLoading.show({
    template: 'Loading...'
  });

  DistanceService.getLocation(function() {
    HttpService.getRestaurants().then(function(response) {
        $scope.items = response.data.restaurant_info;
        console.log(response.data.restaurant_info);
        kiraDistance();
        $ionicLoading.hide();
        console.log($scope.items);
    });
  })
  
  var kiraDistance = function() {
    for(var i=0; i<$scope.items.length; i++ ){
      $scope.items[i].distance = "calculating...";

      (function(i) {
        // setTimeout(function() {
        DistanceService.calculateDistance($scope.items[i].latitude, $scope.items[i].longitude,
          (function(item){
            return function(distance){
              item.distance = distance;
              console.log(item.distance);
              // item.distance = "";
              console.log($scope.items[i].distance) 
            }
          })($scope.items[i])
        );
         // }, i*120);
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