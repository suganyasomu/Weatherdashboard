$(document).ready(function () {
  var enterCity = $("#enterCity");
  var btn = $("button");
  var tbody = $("tbody");
  var btnList = $("#btnList");

  var input = "covid";
  //var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + input + "&api-key=QcDdeSUtRs5wFO3s4stlhN9ZNuM7ATw0";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=Portland&appid=c37004805d008ef699ea9eaa6df56fca";
  //var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=Oregon&appid=c37004805d008ef699ea9eaa6df56fca"

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // for (var i = 0; i <= 4; i++) {

    // }
    //var year = results.response.docs[0].pub_date;
  });

  //This function gets the value from the local storage and loads during the time of page load
  function load() {
    var value = JSON.parse(localStorage.getItem("list"));
    for (var i = 0; i < value.length; i++) {
      var row = $("<tr>");
      var col = $("<td>").text(value[i]);
      row.append(col);
      tbody.append(row);
      row.css("border", "1px solid lightgrey");

      var createNewBtn = $("<button>").text(value[i]);
      createNewBtn.addClass("citybtn")
      createNewBtn.attr("id", "btn-" + i);
      btnList.append(createNewBtn);
      createNewBtn.css("display", "block")
        .css("background-color", "white")
        .css("width", "70%")
        .css("border", "1px solid lightgrey")
        .css("height", "10vh")
        .css("text-align", "left")
        .css("font", "100");
    }
  }

  //Search for CityName and store it in local storage
  function getCityName() {
    var getCity = enterCity.val();
    var myarr = [getCity];

    for (var i = 0; i < myarr.length; i++) {

      var createBtn = $("<button>");
      createBtn.text(myarr[i]);
      createBtn.addClass("citybtn")
      createBtn.attr("id", "btn-" + i);
      btnList.append(createBtn);
      createBtn.css("display", "block")
        .css("background-color", "white")
        .css("width", "70%")
        .css("border", "1px solid lightgrey")
        .css("height", "10vh")
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