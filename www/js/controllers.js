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
      $scope.items[i].rating = parseFloat($scope.items[i].rating);
      (function(i) {
        // setTimeout(function() {
        DistanceService.calculateDistance($scope.items[i].latitude, $scope.items[i].longitude,
          (function(item){
            return function(distance){
              item.distance = distance;
              console.log(item.distance);
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

  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
  // $scope.items = restaurants;
})

.controller('RestaurantCtrl', function($scope, $stateParams, HttpService, $http, $cordovaGeolocation, DistanceService, $ionicLoading) {
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
  $scope.reviews = {};

  $ionicLoading.show({
    template: 'Loading...'
  });
  
  $scope.restaurantId = $stateParams.restaurantId;
  $scope.restaurant = HttpService.getRestaurant($scope.restaurantId);
  $scope.showReview = function(){
    HttpService.getRestaurantReview($scope.restaurantId).then(function(response){
      $scope.reviews = response.data.result;
      $scope.totalReviewer = $scope.reviews.length;
      $ionicLoading.hide();
      console.log($scope.totalReviewer);
    });
  }
  $scope.showReview();

  console.log($scope.reviews);
   
  console.log($scope.restaurantId);

  $scope.totalReviewer = 

  $scope.distance = DistanceService.calculateSingleDistance($scope.restaurant.latitude,$scope.restaurant.longitude);
 
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

.controller('RatingCtrl',function($scope, $filter, $stateParams, $state, $ionicHistory, HttpService){
  $scope.rating = [];
  $scope.restaurantId = parseInt($stateParams.restaurantId);
  $scope.rating.reviewer = '';
  $scope.rating.reviewDescription = '';
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.rating.rate = 0;
  $scope.reviewData = [];
  $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd');
  console.log($scope.date);


  $scope.saveReview = function() {
    // $scope.reviewData({
    //   restaurant_id: $scope.restaurantId,
    //   name: $scope.rating.reviewer,
    //   description: $scope.rating.reviewDescription,
    //   rating: $scope.rating.rate
    // });
    HttpService.createReview({
      restaurant_id: $scope.restaurantId,
      name: $scope.rating.reviewer,
      description: $scope.rating.reviewDescription,
      rating: $scope.rating.rate,
      date: $scope.date
    });
    console.log($scope.reviewData);
    $ionicHistory.goBack();
  }

  // alert($scope.today);
  
})

.controller('ReviewCtrl',function($scope, $stateParams, $state, HttpService, $ionicLoading){
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
  $scope.restaurantId = $stateParams.restaurantId;
  $ionicLoading.show({
    template: 'Loading...'
  });
  
  $scope.showReview = function(){
    HttpService.getRestaurantReview($scope.restaurantId).then(function(response){
      $scope.reviews = response.data.result;
        $ionicLoading.hide();
    });
  }
  $scope.showReview();

})