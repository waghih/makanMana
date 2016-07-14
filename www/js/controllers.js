angular.module('app.controllers', [])
  
.controller('AppCtrl',function($scope, HttpService, $ionicLoading, DistanceService, $ionicSideMenuDelegate){
  var myDate = new Date();
  var hrs = myDate.getHours();

  $scope.breakfastActive = false;
  $scope.lunchActive = false;
  $scope.dinnerActive = false; 
  $scope.items = [];  
  
  $scope.breakfastTab = function(){
    $ionicLoading.show({
      template: 'Loading...'
    });
    getRestaurantByTime(1);
    $scope.breakfastActive = true;
    $scope.lunchActive = false;
    $scope.dinnerActive = false;
  }
  $scope.lunchTab = function(){
    $ionicLoading.show({
      template: 'Loading...'
    });
    getRestaurantByTime(2);
    $scope.lunchActive = true;
    $scope.breakfastActive = false;
    $scope.dinnerActive = false;
  }
  $scope.dinnerTab = function(){
    $ionicLoading.show({
      template: 'Loading...'
    });
    getRestaurantByTime(3);    
    $scope.dinnerActive = true;
    $scope.breakfastActive = false;
    $scope.lunchActive = false;
  }

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  var getRestaurantByTime = function(time){
    DistanceService.getLocation(function() {
      HttpService.getRestaurantsByMeal(time).then(function(response) {
          $scope.items = response.data.result;
          console.log(response.data.result);
          kiraDistance();
          setTimeout(function() {
            $ionicLoading.hide();
          }, 500);
          console.log($scope.items);
      });
    })
  }

  if (hrs < 12){
    getRestaurantByTime(1);
    $scope.breakfastActive = !$scope.breakfastActive;
    $scope.lunchActive = false;
    $scope.dinnerActive = false;
  }        
  else if (hrs >= 12 && hrs < 18){
    getRestaurantByTime(2);
    $scope.lunchActive = !$scope.lunchActive;
    $scope.breakfastActive = false;
    $scope.dinnerActive = false;
  }
  else if (hrs >= 18 && hrs <= 24){
    getRestaurantByTime(3);
    $scope.dinnerActive = !$scope.dinnerActive;
    $scope.breakfastActive = false;
    $scope.lunchActive = false;
  }  
  
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

    }
  }

  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
})

.controller('RestaurantCtrl', function($scope, $stateParams, HttpService, $http, $cordovaSocialSharing, $cordovaGeolocation, $cordovaLaunchNavigator, DistanceService, $ionicLoading) {
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
  $scope.reviews = {};
  $scope.restaurant = {};

  $ionicLoading.show({
    template: 'Loading...'
  });
  

  $scope.restaurantId = $stateParams.restaurantId;
  
  // $scope.restaurant = HttpService.getRestaurant($scope.restaurantId);

  $scope.showDetail = function(){
    HttpService.getRestaurant($scope.restaurantId).then(function(response){
      $scope.restaurant = response.data.result[0];
      $ionicLoading.hide();
      console.log($scope.restaurants);
      $scope.restaurant.rating = parseFloat($scope.restaurant.rating);
      // $scope.restaurant.latitude = parseFloat($scope.restaurant.latitude);
      // $scope.restaurant.longitude = parseFloat($scope.restaurant.longitude);

      $scope.distance = DistanceService.calculateDistance($scope.restaurant.latitude,$scope.restaurant.longitude,function(){});
      console.log($scope.distance);
      var latLng = new google.maps.LatLng($scope.restaurant.latitude,$scope.restaurant.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){

        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });      
       
      });  

    });
  }
  $scope.showDetail();

  // console.log($scope.restaurants);

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
    
 
  

  // console.log(destination);

  $scope.shareViaTwitter = function(restaurant) {
    var message = 'Im at '+restaurant.name+' rated '+restaurant.rating.toFixed(1)+' ✰';
    console.log(message);
      $cordovaSocialSharing.shareViaTwitter(message, null, null).then(function(result) {
      // Success!
      console.log('Success');
    }, function(err) {
      // An error occurred. Show a message to the user
    });  
  }

  $scope.navigate = function(latitude,longitude){
    
    var options = {timeout: 10000, enableHighAccuracy: false};
    var destination = [latitude,longitude];
    console.log(destination);
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var start = [position.coords.latitude,position.coords.longitude];
      
      $cordovaLaunchNavigator.navigate(destination, start).then(function() {
        console.log("Navigator launched");
      }, function (err) {
        console.error(err);
      });

      }, function(error){
          console.log("Could not get location");
      }
    );
  }

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

.controller('SearchCtrl',function($scope, $ionicModal, HttpService, $state){
  var find = [];
  $scope.districts = {
    'Any':[],
    'Johor':[ 'Batu Pahat', 'Johor Bahru', 'Kluang', 'Kota Tinggi', 'Kulai', 'Mersing', 'Muar', 'Pontian Kechil', 'Segamat', 'Tangkak'],
    'Kedah':[ 'Baling', 'Serdang', 'Alor Setar', 'Sungai Petani', 'Jitra', 'Kulim', 'Kuah', 'Kuala Nerang', 'Pendang', 'Pokok Sena', 'Sik', 'Yan'],
    'Kelantan':[ 'Bachok', 'Gua Musang', 'Jeli', 'Kota Bharu', 'Kuala Krai', 'Machang', 'Pasir Mas', 'Pasir Puteh', 'Tanah Merah', 'Tumpat'],
    'Malacca':[ 'Alor Gajah', 'Malacca City', 'Jasin'],
    'Negeri Sembilan':[ 'Kuala Klawang', 'Bandar Seri Jempol', 'Kuala Pilah', 'Port Dickson', 'Rembau', 'Seremban', 'Tampin'],
    'Pahang':[ 'Bentong', 'Bandar Bera', 'Tanah Rata', 'Jerantut', 'Kuantan', 'Kuala Lipis', 'Maran', 'Pekan', 'Raub', 'Kuala Rompin', 'Temerloh'],
    'Penang':['Bukit Mertajam', 'Kepala Batas', 'George Town', 'Sungai Jawi', 'Balik Pulau'],
    'Perak':[ 'Tapah', 'Teluk Intan', 'Gerik', 'Kampar', 'Parit Buntar', 'Batu Gajah', 'Kuala KangsarLarut, Matang ', 'Taiping', 'Seri Manjung', 'Tanjung Malim', 'Seri Iskandar'],
    'Sabah':[ 'Beaufort', 'Beluran', 'Keningau', 'Kota Kinabatangan', 'Kota Belud', 'Kota Kinabalu', 'Kota Marudu', 'Kuala Penyu', 'Kudat', 'Kunak', 'Lahad Datu', 'Nabawan', 'Papar', 'Donggongon', 'Pitas', 'Ranau', 'Sandakan', 'Semporna', 'Sipitang', 'Tambunan', 'Tawau', 'Tenom', 'Tongod', 'Tuaran'],
    'Sarawak':[ 'Asajaya', 'Bau', 'Belaga', 'Betong', 'Bintulu', 'Dalat', 'Matu', 'Julau', 'Kanowit', 'Kapit', 'Kuching', 'Lawas', 'Limbang', 'Lubok Antu', 'Lundu', 'Marudi', 'Matu', 'Bintangor', 'Miri', 'Mukah', 'Pakan', 'Kota Samarahan', 'Saratok', 'Sarikei', 'Selangau', 'Serian', 'Sibu', 'Simunjan', 'Song', 'Sri Aman', 'Tatau', 'Tebedu'],
    'Selangor':[ 'Bandar Baru Selayang', 'Bandar Baru Bangi', 'Kuala Kubu Bharu', 'Klang', 'Teluk Datok', 'Kuala Selangor', 'Subang Jaya', 'Sabak', 'Salak Tinggi'],
    'Terengganu':[ 'Kampung Raja', 'Kuala Dungun', 'Kuala Berang', 'Chukai', 'Kuala Nerus', 'Kuala Terengganu', 'Marang', 'Bandar Permaisuri']
  };
  $scope.states = Object.keys($scope.districts);
  $scope.selectedStatesCities = [];

  $scope.meal = ['Breakfast','Lunch','Dinner'];
  $scope.cuisine = ['Chinese','Chinese Muslim','Indian','Indonesian','Malay','Middle Eastern','Thailand'];
  $scope.foods = [];
  $scope.foodList = [];

  $scope.nearbyData = {data: false};
  $scope.halal = {data: false};
  // $scope.preferenceData = {data: 'Any'};

  $scope.statesSelected = true;

  HttpService.getFoods().then(function(response){
    $scope.foods = response.data.food;
    for(var i=0; i<$scope.foods.length; i++){
      $scope.foodList[i] = $scope.foods[i].food_name;
    }
  });

  $ionicModal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modalCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $ionicModal.fromTemplateUrl('city.html', function(modal) {
    $scope.modalcityCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $ionicModal.fromTemplateUrl('meal.html', function(modal) {
    $scope.modalmealCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $ionicModal.fromTemplateUrl('cuisine.html', function(modal) {
    $scope.modalcuisineCtrl = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });

  $scope.statesData = {data: 'Any'};
  $scope.cityData = {data: 'Any'};
  $scope.mealData = {data: 'Any'};
  $scope.cuisineData = {data: 'Any'};
  $scope.preferenceData = {data: ''};

  
  $scope.openStates = function() {          
    $scope.modalCtrl.show();
  };

   $scope.openCity = function() {   
    $scope.selectedStatesCities = $scope.districts[$scope.statesData.data];
    console.log($scope.selectedStatesCities)      
    $scope.modalcityCtrl.show();
  };

  $scope.openMeal = function() {          
    $scope.modalmealCtrl.show();
  };

   $scope.openCuisine = function() {          
    $scope.modalcuisineCtrl.show();
  };

  $scope.isActive = false;
  $scope.isActive2 = false;
  $scope.isActive3 = false;
  
  $scope.activeButton = function() {
    $scope.isActive = !$scope.isActive;
    $scope.isActive2 = false;
    $scope.isActive3 = false;
  }  
  
  $scope.activeButton2 = function(){
    $scope.isActive2 = !$scope.isActive2;
    $scope.isActive = false;
    $scope.isActive3 = false;

  }

  $scope.activeButton3 = function(){
    $scope.isActive3 = !$scope.isActive3;
    $scope.isActive = false;
    $scope.isActive2 = false;

  }

  $scope.search = function(){

    if($scope.isActive == false && $scope.isActive2 == false && $scope.isActive3 == false){      
      find = {
            // nearby: $scope.nearbyData.data,
        state: $scope.statesData.data,
        city: $scope.cityData.data,
        meal: $scope.mealData.data,
        cuisine: $scope.cuisineData.data,
        food_name: $scope.preferenceData.data,
        halal: $scope.halal.data,
        price: 0
      }
    }
    else if($scope.isActive == true){
      find = {
            // nearby: $scope.nearbyData.data,
        state: $scope.statesData.data,
        city: $scope.cityData.data,
        meal: $scope.mealData.data,
        cuisine: $scope.cuisineData.data,
        food_name: $scope.preferenceData.data,
        halal: $scope.halal.data,
        price: 10
      }
    }else if($scope.isActive2 == true){
      find = {
            // nearby: $scope.nearbyData.data,
        state: $scope.statesData.data,
        city: $scope.cityData.data,
        meal: $scope.mealData.data,
        cuisine: $scope.cuisineData.data,
        food_name: $scope.preferenceData.data,
        halal: $scope.halal.data,
        price: 25
      }
    }else if($scope.isActive3 == true){
      find = {
            // nearby: $scope.nearbyData.data,
        state: $scope.statesData.data,
        city: $scope.cityData.data,
        meal: $scope.mealData.data,
        cuisine: $scope.cuisineData.data,
        food_name: $scope.preferenceData.data,
        halal: $scope.halal.data,
        price: 30
      }
    }

    console.log(find);
    HttpService.storeSearch(find);
    // $state.go('findRestaurant');
  }
})

.controller('ModalCtrl', function($scope) {

  $scope.hideModal = function() {
    $scope.modalCtrl.hide();
    $scope.modalcityCtrl.hide();
    $scope.modalmealCtrl.hide();
    $scope.modalcuisineCtrl.hide();
  };
  
  $scope.doSelectStates = function(item) {
    $scope.statesData.data = item;
    $scope.modalCtrl.hide();
    console.log($scope.statesData.data);
  };

  $scope.doSelectCity = function(item) {
    $scope.cityData.data = item;
    $scope.modalcityCtrl.hide();
    console.log($scope.cityData.data);

  };

  $scope.doSelectMeal = function(item) {
    $scope.mealData.data = item;
    $scope.modalmealCtrl.hide();
    console.log($scope.mealData.data);

  };

  $scope.doSelectCuisine = function(item) {
    $scope.cuisineData.data = item;
    $scope.modalcuisineCtrl.hide();
    console.log($scope.cuisineData.data);

  };

  // $scope.emailContactDetails = function(){
  //     var link = "mailto:?subject=Contact Detail&body="+
  //                    "Name: " + $scope.contact.name + "Comment: " + $scope.contact.comment;     
  //     window.location.href = link;
  //  };

})

.controller('FoundCtrl', function($scope, HttpService, DistanceService, $ionicLoading){
  $scope.items = []
  $scope.searchData = HttpService.getSearchData();
  console.log($scope.searchData);

  DistanceService.getLocation(function() {
    HttpService.searchRestaurant({
        state: $scope.searchData.state,
        city: $scope.searchData.city,
        meal: $scope.searchData.meal,
        cuisine: $scope.searchData.cuisine,
        food_name: $scope.searchData.food_name,
        halal: $scope.searchData.halal,
        price: $scope.searchData.price
    }).then(function(response) {
        $scope.items = response.data.result;
        console.log(response.data.result);
        kiraDistance();
        setTimeout(function() {
          $ionicLoading.hide();
        }, 500);
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

    }
  }

})

.controller('FeedbackCtrl',function($scope, HttpService){
  $scope.feedbackData = {
    subject: '',
    username: '',
    email: '',
    message: ''
  }
  

  $scope.sendFeedback = function(){
    HttpService.postFeedback({
      subject: $scope.feedbackData.subject,
      name: $scope.feedbackData.user,
      email: $scope.feedbackData.email,
      message: $scope.feedbackData.message
    });
  }
});