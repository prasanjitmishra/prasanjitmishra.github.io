var myApp = angular.module('movieApp', ['ngRoute'])
  .config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
  
  $routeProvider
    .when('/', {
      controller: 'homeController',
      templateUrl: 'templates/home.html'
    })
    .when('/movies/:searchedName', {
      controller: 'moviesListController',
      templateUrl: 'templates/moviesList.html'
    })
    .when('/detail/:imdbID', {
      controller: 'movieDetailController',
      templateUrl: 'templates/movieDetail.html'
    })
    .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode({
  enabled: true,
  // requireBase: false
});
  
}])
.service('sharedProperties', function () {
        var searchedMovie = '';
        var moviesList = '';
        var movieDetails = '';
        return {
            getMovieName: function () {
                return searchedMovie;
            },
            setMovieName: function(value) {
                searchedMovie = value;
            },
            getMoviesList: function () {
                return moviesList;
            },
            setMoviesList: function(value) {
                moviesList = value;
            },
            getMovieDetails: function () {
                return movieDetails;
            },
            setMovieDetails: function(value) {
                movieDetails = value;
            },
            getMovieListData: function (url)
            {
                // Return a new promise.
                return new Promise(function(resolve, reject) {
                // Do the usual XHR stuff
                var req = new XMLHttpRequest();
                req.open('GET', url,true);

                req.onload = function() {
                  // This is called even on 404 etc
                  // so check the status
                  if (req.status == 200) {
                    // Resolve the promise with the response text
                    resolve(req.response);
                  }
                  else {
                    // Otherwise reject with the status text
                    // which will hopefully be a meaningful error
                    reject(Error(req.statusText));
                  }
                };

                // Handle network errors
                req.onerror = function() {
                  reject(Error("Network Error"));
                };

                // Make the request
                req.send();
              });
            },
        };
})
.controller('homeController',['$scope', '$http','sharedProperties','$location',
 function ($scope, $http,sharedProperties,$location) {
}])
.controller('moviesListController',['$scope','sharedProperties','$location', '$routeParams',
 function ($scope,sharedProperties,$location,$routeParams) {
    $scope.loader = true;
    $scope.RelatedMoviesDetails = '';
    //get the searched movies
    $scope.SearchedMovieName = $routeParams.searchedName;
    sharedProperties.setMovieName($scope.SearchedMovieName);
    if($scope.SearchedMovieName.length > 0 && /^[0-9A-Za-z]/.test($scope.SearchedMovieName))
    {
        //URL for fetching Details related to serach text
        var getRelatedMoviesUrl = "www.omdbapi.com/?s="+$scope.SearchedMovieName+"&type=movie&tomatoes=true";
        //URL for fetching Details Titlewise
        //var getSingleMovieUrl = "https://www.omdbapi.com/?t="+movieName+'&type=movie&tomatoes=true';     

        sharedProperties.getMovieListData(getRelatedMoviesUrl)
        .then(function(response) {
            $scope.$apply(function(){
                $scope.RelatedMoviesDetails = JSON.parse(response).Search;
                $scope.loader = false;
                $scope.errText = "ERROR : Movie not Found, Search for another one";
            });
        }, function(error) {
            $scope.$apply(function(){
                $scope.RelatedMoviesDetails = '';
                $scope.loader = false;
                $scope.errText = error;
            });
        });
    }
    else
    {
        $scope.errText = "Please enter a movie you want to know about";
    }
}])
.controller('movieDetailController',['$scope','sharedProperties', '$routeParams',
    function ($scope,sharedProperties,$routeParams) {
        $scope.loader = true;
        $scope.SearchedMovieName = sharedProperties.getMovieName();
        console.log("movieDetailController");
        var getMovieUrl = "www.omdbapi.com/?i="+$routeParams.imdbID+"&type=movie&tomatoes=true";

        sharedProperties.getMovieListData(getMovieUrl)
        .then(function(response) {
            $scope.$apply(function(){
                $scope.SingleMovieDetails = JSON.parse(response);
                $scope.loader = false;
            });
        }, function(error) {
            $scope.$apply(function(){
                $scope.SingleMovieDetails = '';
                $scope.loader = false;
                $scope.errText = error;
            });
        });
        
}]);



// myApp.run([
//   '$rootScope',
//   function($rootScope) {
//     // see what's going on when the route tries to change
//     $rootScope.$on('$routeChangeStart', function(event, next, current) {
//       // next is an object that is the route that we are starting to go to
//       // current is an object that is the route where we are currently
//       // var currentPath = current.originalPath;
//       // var nextPath = next.originalPath;

//       console.log('Starting to leave %s to go to %s', current, next);
//       console.log(current);
//     });
//   }
// ]);