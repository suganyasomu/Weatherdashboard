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
  var currentdate = $("#currentdate");
  console.log(currentdate);
  var curWeatherIcon = $(".curWeatherIcon");
  var lat;
  var lon;
  var lastSearchVal;

  var getCity;

  //This function gets the value from the local storage and loads during the time of page load
  function load() {
    var value = JSON.parse(localStorage.getItem("list"));

    if (value != null) {
      lastSearchVal = value[value.length - 1];
      getweather(lastSearchVal);
      for (var i = 0; i < value.length; i++) {
        var createNewBtn = $("<button>").text(value[i]);
        createNewBtn.addClass("citybtn");
        createNewBtn.attr("id", "btn-" + i);
        btnList.append(createNewBtn);
        createNewBtn

          .css("background-color", "white")
          .css("width", "60%")
          .css("border", "1px solid lightgrey")

          .css("text-align", "left")
          .css("font", "100");
      }
    } else {
      var defaultVal = "Portland";
      getweather(defaultVal);
    }
  }

  //Get the values for Temperature, Humidity, WindSpeed from weather API call
  function getweather(val) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      val +
      "&units=imperial&appid=c37004805d008ef699ea9eaa6df56fca";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      //current date
      var currentDateVal = moment.unix(response.dt).format("MM/DD/YYYY");

      //Get weather icon
      var code = response.weather[0].icon;
      var url = "http://openweathermap.org/img/w/" + code + ".png";

      var img = $(".curWeather");
      img.attr("src", url);
      img.css("display", "inline-block");

      name.text(response.name + " " + "(" + currentDateVal + ")");

      temperature.text(response.main.temp + " \xB0F");

      humidity.text(response.main.humidity + " %");
      windSpeed.text(response.wind.speed + " MPH");
      lat = response.coord.lat;
      lon = response.coord.lon;

      //get the values of UV index
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
        uv.css("padding", "8px");
        if (UVresponse.value < 3) {
          uv.css("background-color", "#299501");
        } else if (UVresponse.value >= 3 && UVresponse.value < 6) {
          uv.css("background-color", "#f7e401");
        } else if (UVresponse.value >= 6 && UVresponse.value < 8) {
          uv.css("background-color", "#f95901");
          uv.css("color", "white");
        } else if (UVresponse.value >= 8 && UVresponse.value < 10) {
          uv.css("background-color", "#d90011");
          uv.css("color", "white");
        } else {
          uv.css("background-color", "#6c49cb");
          uv.css("color", "white");
        }
      });

      //Forecast API call
      var queryUrlForecast =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly&units=imperial&appid=c37004805d008ef699ea9eaa6df56fca";

      $.ajax({
        url: queryUrlForecast,
        method: "GET",
      }).then(function (responseForecast) {
        console.log(responseForecast);

        for (var i = 1; i < 6; i++) {
          console.log("create card");
          var forecastDateVal = moment
            .unix(responseForecast.daily[i].dt)
            .format("MM/DD/YYYY");

          var divCard = $("<div>");
          divCard.addClass("column");
          var divBody = $("<div>");
          divBody.addClass("card");

          var p1 = $("<p>").text(forecastDateVal);
          p1.addClass("card-text");
          var iconcode = responseForecast.daily[i].weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          var weatherImage = $("<img>").attr("src", iconurl);
          weatherImage.css("width", "80px");
          weatherImage.css("height", "80px");
          var p2 = $("<p>");
          p2.addClass("card-text").text(
            "Temp: " + responseForecast.daily[i].temp.day + " \xB0F"
          );
          var p3 = $("<p>");
          p3.addClass("card-text").text(
            "Humidity: " + responseForecast.daily[i].humidity + "%"
          );

          divCard.append(divBody);
          divBody.append(p1);
          divBody.append(weatherImage);
          divBody.append(p2);
          divBody.append(p3);

          cardDetails.append(divCard);
          if (i >= 2) {
            divCard.css("color", "white");
            divCard.css("margin-left", "40px");
            divCard.css("width", "4%");
          } else {
            divCard.css("color", "white");
            divCard.css("width", "4%");
          }
        }
      });
    });
  }

  //Search for CityName and store it in local storage
  function getCityName() {
    getCity = enterCity.val();

    var myarr = getCity;
    console.log(myarr);
    if (getCity != "") {
      cardDetails.empty();
      getweather(getCity);
      var getStorageList = JSON.parse(localStorage.getItem("list"));
      console.log(getStorageList);

      var createBtn = $("<button>");

      createBtn.text(getCity);
      createBtn.addClass("citybtn");

      if (getStorageList === null) {
        createBtn.attr("id", "btn-0");
      } else {
        createBtn.attr("id", "btn-" + getStorageList.length);
      }
      btnList.append(createBtn);
      createBtn

        .css("background-color", "white")
        .css("width", "60%")
        .css("border", "1px solid lightgrey")

        .css("text-align", "left")
        .css("font", "100");

      if (getStorageList != null) {
        getStorageList.push(getCity);
        localStorage.setItem("list", JSON.stringify(getStorageList));
      } else {
        var value = [getCity];
        localStorage.setItem("list", JSON.stringify(value));
      }
    }

    enterCity.val("");
  }

  function historyButton(event) {
    var getID = event.target.id;
    console.log(getID);
    var btnVal = $("#" + getID);
    var getVal = btnVal[0].textContent;
    console.log(getVal);
    cardDetails.empty();
    getweather(getVal);
  }

  $(btn).on("click", getCityName);

  $(document).on("click", ".citybtn", historyButton);

  load();
});
