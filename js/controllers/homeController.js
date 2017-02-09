(function () {
angular.module('movieApp',[])
.controller('homeController',['$scope', '$http','sharedProperties', function ($scope, $http,sharedProperties) {
    console.log("hello");
    $scope.fetchMovies = function(movieName){
        //Set the value of the variable to use in other controllers
        sharedProperties.setProperty(movieName);
        
        if(movieName.length > 0 && /^[0-9A-Za-z]/.test(movieName))
        {
            //URL for fetching Details related to serach text
            var getRelatedMoviesUrl = "https://www.omdbapi.com/?s="+movieName+"&type=movie&tomatoes=true";
            //URL for fetching Details Titlewise
            //var getSingleMovieUrl = "https://www.omdbapi.com/?t="+movieName+'&type=movie&tomatoes=true';     
            
            $http.get(getRelatedMoviesUrl)
            .then(function(response) {
                if(response.data.Response == 'True'){
                    $scope.RelatedMoviesDetails = response.data;
                }
                else
                {
                    $scope.errText = "No movies found";
                }
            });
        }
        else
        {
            $scope.errText = "Please enter a movie name";
        }
    };
}]);

})();