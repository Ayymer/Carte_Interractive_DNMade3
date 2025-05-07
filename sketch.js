function setup() { 
  noCanvas();
  var map = L.map('mapid').setView([47.216671, -1.55], 15);

	L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);

L.marker([47.216671, -1.55]).addTo(map)
    .bindPopup('Nantes.<br> Carte.')
    .openPopup();

L.marker([47.201316327544696, -1.5728756262744052]).addTo(map)
    .bindPopup('Ware.<br> Carte.')
    .openPopup();

} 


function draw() { 

}