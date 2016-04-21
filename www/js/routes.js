angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js    
  "use strict";

  $stateProvider
  .state('menu.home', {
    // cache: false,
    url: '/home',
    views:{
      'side-menu':{
        templateUrl: 'templates/home.html', 
        controller: 'AppCtrl'
      }
    }
    // abstract: true,
  })
  .state('menu.restaurant',{
    url:'/restaurant/:restaurantId',
    views:{
      'side-menu':{
      templateUrl: 'templates/restaurant.html',
      controller: 'RestaurantCtrl'
      }
    } 
  })
  .state('menu.search', {
    url: '/search',
    views:{
      'side-menu':{ 
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
      }
    }
  })
  .state('menu.ratingForm',{
    url:'/ratingForm/:restaurantId',
    views:{
      'side-menu':{
      templateUrl: 'templates/ratingForm.html',
      controller: 'RatingCtrl'
      }
    }
  })
  .state('menu.reviews',{
    url:'/reviews/:restaurantId',
    views:{
      'side-menu':{
      templateUrl: 'templates/reviews.html',
      controller: 'ReviewCtrl'
      }
    }
    
  })
  .state('menu2.about',{
    url:'/about',
    views:{
      'side-menu2':{
      templateUrl: 'templates/about.html'
      }
    }
    
  })
  .state('menu', {
    url: '/side-menu',
    templateUrl: 'templates/menu.html',
    abstract:true
  })
  .state('menu2',{
    url:'/side-menu2',
    templateUrl: 'templates/menu2.html',
    abstract:true
  })
  .state('menu2.contact',{
    url:'/contact',
    views:{
      'side-menu2':{
        templateUrl: 'templates/feedback.html'
      }
    }
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
  $urlRouterProvider.otherwise('/side-menu/home'); 
    

});