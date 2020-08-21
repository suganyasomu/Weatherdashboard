$(document).ready(function () {
  var enterCity = $("#enterCity");
  var btn = $("button");
  var tbody = $("tbody");
  var btnList = $("#btnList");
  var temperature = $("#temp");
  var humidity = $("#humidity");
  var windSpeed = $("#wind");
  var uv = $("#uv");
  var cardBody = $(".card-body");
  var cardText = $(".card-text");
  var name = $("#name");
  var cardDetails = $("#cardDetails");
  var lat;
  var lon;

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=Portland&units=imperial&appid=c37004805d008ef699ea9eaa6df56fca";




  var queryUrlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=minutely,hourly&units=imperial&appid=c37004805d008ef699ea9eaa6df56fca";

  //var queryUrlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&exclude=minutely,hourly&units=imperial&appid=c37004805d008ef699ea9eaa6df56fca";


  //Get the values for Temperature, Humidity, WindSpeed

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    name.text(response.name);

    temperature.text(response.main.temp + " \xB0F");
    //temperatureConverter(response.main.temp);

    humidity.text(response.main.humidity + " %");
    windSpeed.text(response.wind.speed + " MPH");
    lat = response.coord.lat;
    lon = response.coord.lon;
    var queryURLUV =
      "http://api.openweathermap.org/data/2.5/uvi?appid=c37004805d008ef699ea9eaa6df56fca&lat=" +
      lat +
      "&lon=" +
      lon +
      "";

    $.ajax({
      url: queryURLUV,
      method: "GET",
    }).then(function (UVresponse) {
      console.log(UVresponse);
      uv.text(UVresponse.value);
    });
    createCard();

  });

  function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    temperature.text(((valNum - 273.15) * 1.8 + 32).toFixed(1) + " \xB0F");
    var val = (((valNum - 273.15) * 1.8 + 32).toFixed(1) + " \xB0F");
  }



  function createCard() {

    //   <div class="card col">
    //   <div class="card-body">
    //     <p class="card-text"></p>
    //     <p class="card-text">
    //       Temp:
    //     </p>
    //     <p class="card-text">
    //       Humidity:
    //     </p>
    //   </div>
    // </div>

    $.ajax({
      url: queryUrlForecast,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      for (var i = 0; i < 5; i++) {

        var unixDate = new Date(response.daily[i].dt * 1000);
        var month = unixDate.getMonth();

        var date = unixDate.getDate();
        var year = unixDate.getFullYear();
        var forecastdate = month + "/" + date + "/" + year;

        //console.log(response.list[i].dt_txt);

        var divCard = $("<div>");
        divCard.addClass("column");
        var divBody = $("<div>");
        divBody.addClass("card");

        var p1 = $("<p>").text(forecastdate);
        p1.addClass("card-text");
        var iconcode = response.daily[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        var weatherImage = $("<img>").attr("src", iconurl);
        weatherImage.addClass("card-text");
        var p2 = $("<p>");
        p2.addClass("card-text").text("humidity:" + response.daily[i].humidity);
        var p3 = $("<p>");
        p3.addClass("card-text").text("Temp:" + response.daily[i].temp.day + " \xB0F");




        // .css("padding", "0 10 px");
        // divCard.css("width", "50%")

        divCard.append(divBody);
        divBody.append(p1);
        divBody.append(weatherImage);
        divBody.append(p2);
        divBody.append(p3);

        cardDetails.append(divCard);



      }

    });



  }

  //This function gets the value from the local storage and loads during the time of page load
  function load() {
    var value = JSON.parse(localStorage.getItem("list"));

    if (value != null) {
      for (var i = 0; i < value.length; i++) {
        var createNewBtn = $("<button>").text(value[i]);
        createNewBtn.addClass("citybtn");
        createNewBtn.attr("id", "btn-" + i);
        btnList.append(createNewBtn);
        createNewBtn
          .css("display", "block")
          .css("background-color", "white")
          .css("width", "70%")
          .css("border", "1px solid lightgrey")
          .css("height", "10vh")
          .css("text-align", "left")
          .css("font", "100");
      }
    }
  }

  //Search for CityName and store it in local storage
  function getCityName() {
    var getCity = enterCity.val();
    var myarr = [getCity];

    for (var i = 0; i < myarr.length; i++) {
      var createBtn = $("<button>");
      createBtn.text(myarr[i]);
      createBtn.addClass("citybtn");
      createBtn.attr("id", "btn-" + i);
      btnList.append(createBtn);
      createBtn
        .css("display", "block")
        .css("background-color", "white")
        .css("width", "70%")
        .css("border", "1px solid lightgrey")
        .css("height", "5vh")
        .css("text-align", "left")
        .css("font", "100");
      var getStorageList = JSON.parse(localStorage.getItem("list"));
      console.log(getStorageList);

      if (getStorageList != null) {
        getStorageList.push(myarr[i]);
        localStorage.setItem("list", JSON.stringify(getStorageList));
      } else {
        var value = [myarr[i]];
        localStorage.setItem("list", JSON.stringify(value));
      }
    }

    enterCity.val("");
  }

  $(btn).on("click", getCityName);
  load();

});