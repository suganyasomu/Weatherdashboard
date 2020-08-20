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
  console.log(cardBody);
  // children("p").length);

  var lat;
  var lon;

  var input = "covid";

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=Portland&appid=c37004805d008ef699ea9eaa6df56fca";
  var queryUrlForecast =
    "https://api.openweathermap.org/data/2.5/forecast?q=Portland&appid=c37004805d008ef699ea9eaa6df56fca";

  //Get the values for Temperature, Humidity, WindSpeed

  val = $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    console.log(response.name);
    name.text(response.name);
    temperatureConverter(response.main.temp);

    humidity.text(response.main.humidity + " %");
    windSpeed.text(response.wind.speed + " MPH");
  });

  function temperatureConverter(valNum) {
    valNum = parseFloat(valNum);
    temperature.text((valNum - 273.15) * 1.8 + 32 + " F");
  }

  $.ajax({
    url: queryUrlForecast,
    method: "GET",
  }).then(function (response) {
    console.log(response.list);
  });

  // lat = data.respone.coord.lat;
  // console.log(lat);

  // lon = data.coord.lon;
  // console.log(lon);

  // var queryURLUV =
  //   "http://api.openweathermap.org/data/2.5/uvi?appid=c37004805d008ef699ea9eaa6df56fca&lat=" +
  //   lat +
  //   "&lon=" +
  //   lon +
  //   "";
  // //Get the values for UV
  // $.ajax({
  //   url: queryURLUV,
  //   method: "GET",
  // }).then(function (responseUV) {
  //   console.log(responseUV);
  //   uv.text();
  // });

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
