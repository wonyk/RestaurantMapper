//Initialize OneMap and select one style
const map = onemap.initializeMap("map", "default", 11, 1.3, 103.8, 0.8);

map.setMaxBounds([
  [1.56073, 104.1147],
  [1.16, 103.502],
]);

//Setup configuration for REST API Services (Your Access Token)
//Our Documentation @  https://docs.onemap.sg

axios
  .get("http://localhost:3002/api/v1/restaurants")
  .then((res) => {
    addPinsToMap(res.data);
  })
  .catch((err) => {
    console.error(err);
  });

//Add GeoJSON to map
const addPinsToMap = (data) => {
  const geojson = L.geoJSON(data, {
    onEachFeature: function (feature, layer) {
      const { name, loc, description, numCase } = feature.properties;
      layer.bindPopup(
        "<h1>" +
          name +
          " @ " +
          loc +
          "</h1><p>Description: " +
          description +
          "</p>" +
          "<p>Case Numbers: " +
          numCase +
          "</p>"
      );
      //Sets Icon information
      const icon = L.icon({
        iconUrl:
          numCase < 250 ? "/public/food-icon.png" : "/public/food-icon-red.png",
      });
      layer.setIcon(icon);
    },
  });

  geojson.addTo(map);

  //Fit bound to markers
  map.fitBounds(geojson.getBounds());
};
