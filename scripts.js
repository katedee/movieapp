var movieApp = {};
movieApp.api_key = "76aa020824ec0d21b195b271a88ceb0f";
movieApp.init = function(){
	movieApp.grabConfig();
	// movieApp.getToken();
	// movieApp.getSessionId();
	//listen for a click on the star ratings
	$('body').on('change','input[type=radio]',function(){
		var rating = $(this).val();
		var movieId = $(this).attr('id').split('-')[0].replace('movie','');
		console.log(rating);
		console.log(movieId);
		movieApp.ratingHandler(rating,movieId);
	});//on click fieldset
	$('body').on('click', 'ul.allTheThings li', function(){
		movieApp.genreId = $(this).data('genreid');
		movieApp.getThisMovieGenre();
	});//li click
};//end moiveApp.init

//this function will go to the movedb api and get all the config date that we need
//when it finishes it will put the date it gets onto movieApp.config
movieApp.grabConfig = function(){
	var configURL = 'http://api.themoviedb.org/3/configuration';
	$.ajax(configURL,{
		type : 'GET',
		dataType : 'jsonp',
		data : {
			api_key : movieApp.api_key
		},//data
		success: function(config){
			movieApp.config = config;
			movieApp.getGenreList();
		}//config success
	});//end config ajax
};//grabConfig

movieApp.grabTopRated = function(){
	var topRatedURL = 'http://api.themoviedb.org/3/movie/top_rated'
	$.ajax(topRatedURL,{
		type: 'GET',
		dataType: 'jsonp',
		data: {
			api_key : movieApp.api_key
		},//data
		success: function(data) {
			console.log(data);
			//run the displayMovies
			movieApp.displayMovies(data.results);
		}//success
	}); //end top rated ajax
};//grabTopRated

movieApp.getThisMovieGenre = function(){
	var thatMovieGenre = 'http://api.themoviedb.org/3/genre/'+movieApp.genreId+'/movies'
	$.ajax(thatMovieGenre,{
		type: 'GET',
		dataType: 'jsonp',
		data: {
			api_key : movieApp.api_key
		},
		success: function(data){
			console.log(data);
			movieApp.displayMovies(data.results);
		}
	});//end ajjax
};//getThisMovieGenre

movieApp.getGenreList = function() {
	var genreListURL = 'http://api.themoviedb.org/3/genre/list';
	$.ajax(genreListURL,{
		type: 'GET',
		dataType: 'jsonp',
		data: {
			api_key : movieApp.api_key
		},
		success : function(genreList) {
			movieApp.displayGenreList(genreList.genres);
			console.log(genreList.genres);
		}
	});//genre list ajax
}

movieApp.displayGenreList = function(listGenres){
	var list = $('<ul>').addClass('allTheThings');
	var listWrap = $('<div>').addClass('allGenres clearfix').append(list);
	$('body').append(listWrap);
	for (var i = 0; i < listGenres.length; i++) {
		var selection = $('<li>').text(listGenres[i].name);
		var selection = selection.attr('data-genreid',listGenres[i].id);
		list.append(selection);
	};
	movieApp.grabTopRated();//call the next thing to do
};//displayGenreList

movieApp.displayMovies = function(movies){
	$('.movie').remove();
	var allTheMovies = $('<div>').addClass('allTheFilms clearfix');
	$('body').append(allTheMovies);
	for (var i = 0; i < movies.length; i++) {
		var title = $('<h2>').text(movies[i].title);
		var image = $('<img>').attr('src', movieApp.config.images.base_url + "w500" + movies[i].poster_path);
		var rating= $('fieldset.rateMovie')[0].outerHTML;
		rating = rating.replace(/star/g,'movie' + movies[i].id+'-star');
		rating = rating.replace(/rating/g, 'rating-'+movies[i].id);
		var movieWrap = $('<div>').addClass('movie');
		movieWrap.append(title,image,rating);
		allTheMovies.append(movieWrap);
		// console.log(image);
	};//for movies
};//displayMovies

movieApp.ratingHandler = function(rating,movieId){
	$.ajax('http://api.themoviedb.org/3/movie/'+movieId+'/rating',{
		type : 'POST',
		data : {
			api_key : movieApp.api_key,
			guest_session_id : movieApp.session_id,
			value : rating * 2
		},
		success : function(response) {
			console.log(response);
			if(response.status_code) {
				alert("Thanks for the vote");
			}
			else {
				alert(response.status_message);
			}
		}
	});//ajaxPost
};//ratingHandler

movieApp.getSessionId = function() {
	$.ajax('http://api.themoviedb.org/3/authentication/guest_session/new',{
		data: {
			api_key : movieApp.api_key,
		},//data
		type: 'GET',
		dataType: 'jsonp',
		success: function(session){
			movieApp.session_id = session.guest_session_id;
			console.log(movieApp.session_id);
		}
	});//ajax
};//getSessionId

$(function(){
	movieApp.init();
});//doc ready

// var movieApp = {
// 	age : 37,
// 	height : "5 foot"
// };

// OR

// var movieApp = {}

// movieApp.age = 37;
// movieApp.height = "5 foot";