angular.module('movieApp',[])
    .controller('movieController',['$scope', '$http', function ($scope, $http) {
        $scope.fetchMovies = function(movieName){
            if(movieName.length > 0 && /^[0-9A-Za-z]/.test(movieName))
            {
                //URL for fetching Details related to serach text
                var getRelatedMoviesUrl = "https://www.omdbapi.com/?s="+movieName+'&type=movie&tomatoes=true';
                //URL for fetching Details Titlewise
                //var getSingleMovieUrl = "https://www.omdbapi.com/?t="+movieName+'&type=movie&tomatoes=true';     
                
                $http.get(getRelatedMoviesUrl)
                .then(function(response) {
                    if(response.data.Response == 'True'){
                        $scope.errFlag = 'False';
                        $scope.RelatedMoviesDetails = response.data;
                        //By default fetch Detail for the first Movie after search
                        $scope.SingleMovieDetails = $scope.getMovieDetail($scope.RelatedMoviesDetails.Search[0].imdbID);
                    }
                    else
                    {
                        $scope.errFlag = 'True';
                        $scope.errText = "No movies found";
                    }
                });
            }
            else
            {    
                $scope.errFlag = 'True';
                $scope.errText = "Please enter a movie name";
            }
        };
        
        $scope.getMovieDetail = function(imdbId){
            var getMovieUrl = "https://www.omdbapi.com/?i="+imdbId+'&type=movie&tomatoes=true';
            $http.get(getMovieUrl)
            .then(function(response) {
                    $scope.SingleMovieDetails = response.data;
            });  
        };
        
        $scope.submit = function(){
            $scope.fetchMovies($scope.searchedText);
        };
        
        $scope.searchedText = "harry potter";                   //By default search text is "Harry Potter"
        $scope.fetchMovies($scope.searchedText);                //By default fetchDetail for "Harry Potter"
    }]);