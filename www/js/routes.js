angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js    
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

});