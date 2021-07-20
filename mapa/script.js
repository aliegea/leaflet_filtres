var map = L.map("mapid").on("load", onMapLoad).setView([41.4, 2.206], 8);
//map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {}
).addTo(map);

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
let data_markers = [];
let foodsArr = [];
let filter;

function onMapLoad() {
  console.log("Mapa cargado");

  $.get("http://192.168.64.4/mapa/api/apiRestaurants.php", function (data) {
    let data_markers = JSON.parse(data);

    let foodNames;
    let uniqueFoods = [];
    for (i = 0; i < data_markers.length; i++) {
      var marker = L.marker([data_markers[i].lat, data_markers[i].lng]);
    }
    markers.addLayer(marker);

    for (let data of data_markers) {
      foodNames = data.kind_food.split(",");

      for (i = 0; i < foodNames.length; i++) {
        uniqueFoods.push(foodNames[i]);
      }
      foodsArr = uniqueFoods.filter(duplicados).sort();
    }

    console.log(foodsArr);
    for (let j = 0; j < foodsArr.length; j++) {
      $("#kind_food_selector").append(
        $("<option>", {
          value: foodsArr[j],
          text: foodsArr[j],
        })
      );
    }
    render_to_map(data_markers, "All");
    function duplicados(elem, index, uniqueFoods) {
      return uniqueFoods.indexOf(elem) === index;
    }

    $("#kind_food_selector").on("change", function () {
      console.log(this.value);
      render_to_map(data_markers, this.value);
    });

    function render_to_map(data_markers, filter) {
      markers.clearLayers();

      for (let i = 0; i < data_markers.length; i++) {
        if (data_markers[i].kind_food.includes(filter)) {
          let marker = L.marker(
            new L.LatLng(data_markers[i].lat, data_markers[i].lng)
          )
            .bindPopup(
              data_markers[i].name +
                "<br> Kind of food: <br>" +
                data_markers[i].kind_food
            )
            .openPopup();
          markers.addLayer(marker).addTo(map).openPopup();
        }
      }
    }
  });
}
