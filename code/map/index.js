

let map;
let url = "https://services3.arcgis.com/rl7ACuZkiFsmDA2g/arcgis/rest/services/Environment/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"

const req = new Request(url)
let arr = [];
let ghgsort = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.7315, lng: -79.7624 },
    zoom: 12,
  });
  for (let i = 0; i < arr.length; i++) {
    const e = arr[i];
    debug.log(e);
  }
}
window.initMap = initMap;
fetch(req)
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on API server!');
    }
 })
  .then((response) => {
    arr = response.features
    ghgsort = arr.slice()
    ghgsort.sort((a,b) => (a.attributes.GHG_EMISSIONS_KG > b.attributes.GHG_EMISSIONS_KG) ? 1 : ((b.attributes.GHG_EMISSIONS_KG > a.attributes.GHG_EMISSIONS_KG) ? -1 : 0))
    ghgsort.reverse()
    arr.forEach(e => {
      var polygon = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.1,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: { lat: e.geometry.y, lng: e.geometry.x },
        radius: 50,
      });
      let ghg = e.attributes.GHG_EMISSIONS_KG
      let ghgi = ghgsort.findIndex((el) => el.attributes.GHG_EMISSIONS_KG == ghg)
      if (ghgi < 178) {
        polygon.setOptions({fillColor: "#FF0000"}) 
      } else if (ghgi < 178*2) {
        polygon.setOptions({fillColor: "#FFA500"}) 
      } else if (ghgi < 178*3) {
        polygon.setOptions({fillColor: "#FFA500"}) 
      } else {
        polygon.setOptions({fillColor: "#FFA500"}) 
      }
      var infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(polygon, 'mouseover', function (i) {
        infoWindow.setContent(e.attributes.SITE_NAME);
        var latLng = i.latLng;
        infoWindow.setPosition(latLng);
        infoWindow.open(map);
      });
      google.maps.event.addListener(polygon, 'mouseout', function (i) {
        infoWindow.close(map);
      });
      google.maps.event.addListener(polygon, 'click', function (i) {
        var panel = document.getElementById("panel")
        panel.hidden = false
        document.getElementById("locname").innerText = e.attributes.SITE_NAME 
        document.getElementById("elec").innerText = e.attributes.ELECTRICITY_KWH 
        document.getElementById("ghg").innerText = e.attributes.GHG_EMISSIONS_KG
        document.getElementById("nat").innerText = e.attributes.NATURAL_GAS_M3
      });
    });
  }).catch((error) => {
    console.error(error);
  });
