function searchWeather(name) {
  var APIKey = "e79e860f1526eb9cc2572046fff7a30c"; // currently Alex's API key
  var userInput = $("#city-input").val();
  // building URL we need to access API
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    userInput +
    "&appid=" +
    APIKey;

  $.ajax({
    // Ajax function to access query
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var cityName = $("<h1>").text(response.name); // creating the variable for city name
    var mainWeather = $("<h2>").text(response.weather[0].main); // creating the name for the main weather data value
    var weatherIcon = response.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
    iconEl = $("<img>").attr("src", iconURL);
    $("#cityinfo-div").empty(); // emptying div
    $("#cityinfo-div").append(cityName, mainWeather);// appending the under inputted city name, and the corresponding main weather data value
    $(mainWeather).append(iconEl); //appends weather icon after the weather description
  });
}

function getCityID() {
  //function to extract cityID of user input from zomato api
  var userInput = $("#city-input").val();
  var queryURL = "https://developers.zomato.com/api/v2.1/cities?q=" + userInput;

  $.ajax({
    url: queryURL,
    method: "GET",
    headers: {
      Accept: "application/json",
      "user-key": "6be02bb0652cc2706beef4c9ffe979b1",
    },
  }).then(function (response) {
    console.log(response.location_suggestions[0].id);
    var userCity = response.location_suggestions[0].id; //grabs the first location suggestion's ID
    function getRestaurants(userCity) {
      //another function to serach for restaurants based on city ID
      var queryURL2 =
        "https://developers.zomato.com/api/v2.1/search?entity_id=" +
        userCity +
        "&entity_type=city&count=100";
      console.log(queryURL2);

      $.ajax({
        url: queryURL2,
        method: "GET",
        headers: {
          Accept: "application/json",
          "user-key": "6be02bb0652cc2706beef4c9ffe979b1",
        },
      }).then(function (response) {
        console.log(response);
        var randomInd = Math.floor(Math.random() * 20);

        var randomRestaurant = response.restaurants[randomInd].restaurant.name;
        var mainURL = response.restaurants[randomInd].restaurant.url;
        var menuURL = response.restaurants[randomInd].restaurant.menu_url;
        var featImg = $("<img>").attr("src", response.restaurants[randomInd].restaurant.featured_image);
        var restaurantEl = $("<a>").text(randomRestaurant);
        var menuEl = $("<a>").text("Menu");
        var restTiming = response.restaurants[randomInd].restaurant.timings;
        var timingEl = $("<div>").text("Hours of Operation: "+restTiming);
        var restCuisine = response.restaurants[randomInd].restaurant.cuisines;
        var cuisineEl = $("<div>").text("Cuisine: "+restCuisine);
        var restRating = response.restaurants[randomInd].restaurant.user_rating.aggregate_rating;
        var ratingEl = $("<div>").text("Aggregate Rating: "+restRating);
        var restLocation = response.restaurants[randomInd].restaurant.location.address;
        console.log(restLocation);
        console.log(restLocation.replace(/\s+/g, "+"));
        var locLink = $("<a>").text(restLocation);

        menuEl.attr("href", menuURL);
        menuEl.attr("target", "_blank");
        restaurantEl.attr("href", mainURL);
        restaurantEl.attr("target", "_blank");
        locLink.attr("href", "https://google.com/maps/place/" + restLocation.replace(/\s+/g, "+"));
        locLink.attr("target", "_blank");

        $("#restaurantinfo-div").append(restaurantEl,"<br>" , locLink, ratingEl, cuisineEl, menuEl, timingEl, featImg);
      });
    }

    getRestaurants(userCity);
  });
}

$("#select-city").on("click", function (event) {
  // creating the on click event to take in the user input city value
  event.preventDefault();
  var inputCity = $("#city-input").val().trim();

  searchWeather(inputCity);
  getCityID(inputCity);
});
