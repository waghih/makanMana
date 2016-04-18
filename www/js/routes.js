angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js    
  "use strict";

  $stateProvider
  .state('home', {
    // cache: false,
    url: '/home',
    // abstract: true,
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
  })
  .state('ratingForm',{
    url:'/ratingForm/:restaurantId',
    templateUrl: 'templates/ratingForm.html',
    controller: 'RatingCtrl'
  })
  .state('reviews',{
    url:'/reviews/:restaurantId',
    templateUrl: 'templates/reviews.html',
    controller: 'ReviewCtrl'
  });
  // .state('');

  // .state('tabs', {
  //     url: "/tab",
  //     abstract: true,
  //     templateUrl: "templates/home.html"
  //   })
  //   .state('home.breakfast', {
  //     url: "/breakfast",
  //     views: {
  //       'breakfast-tab': {
  //         templateUrl: "templates/home.html",
  //         controller: 'AppCtrl'
  //       }
  //     }
  //   })
  //   .state('home.lunch', {
  //     url: "/lunch",
  //     views: {
  //       'lunch-tab': {
  //         templateUrl: "templates/home.html",
  //         controller: 'AppCtrl'
  //       }
  //     }
  //   })
  //   .state('home.dinner', {
  //     url: "/dinner",
  //     views: {
  //       'dinner-tab': {
  //         templateUrl: "templates/home.html",
  //         controller: 'AppCtrl'
  //       }
  //     }
  //   });
  $urlRouterProvider.otherwise('/home'); 
    

});