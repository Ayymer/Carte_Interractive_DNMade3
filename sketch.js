// Sound variables
let sound2;

// Geographic coordinates for the user
let userLat = 47.216671;
let userLng = -1.55;

// UI elements
let userSize = 80;
let isNearMacadam = false;
let user, map, canvas;
let speakerLoudIcon, speakerQuietIcon;
let isSoundPlaying = false;

// Proximity settings
const proximityThreshold = 500; // Distance in  meters to trigger sound

// Venue coordinates
// Macadam marker coordinates
const macadamLat = 47.19750561442489;
const macadamLng = -1.5891794806023196;

// Warehouse marker coordinates
const warehouseLat = 47.201316327544696;
const warehouseLng = -1.5728756262744052;

// Le Floride marker coordinates
const leflorideLat = 47.20063223509995;
const leflorideLng = -1.57196726065538;

// Colors Club marker coordinates
const colorsclubLat = 47.21581175781134;
const colorsclubLng = -1.5519070741454308;

// Stereolux marker coordinates
const stereoluxLat = 47.20546919327099;
const stereoluxLng = -1.5633197992729915;

// Elephant Club marker coordinates
const elephantclubLat = 47.21254507753584;
const elephantclubLng = -1.5591211820722817;

// Bootlegger marker coordinates
const bootleggerLat = 47.21281821333305;
const bootleggerLng = -1.5555831183274738;

// 19:33 Cocktail Experience marker coordinates
const cocktailexpLat = 47.21270265902998;
const cocktailexpLng = -1.5639114894911312;

// Le Lieu Unique marker coordinates
const lieuuniqueLat = 47.21569150800053;
const lieuuniqueLng = -1.5454752894909598;

// Zénith Nantes Métropole marker coordinates
const zenithLat = 47.22880839909674;
const zenithLng = -1.6274719630164791;

// Sound settings
const maxVolume = 0.6; // Maximum volume level
const minVolume = 0.05; // Minimum volume when at threshold distance
const volumeFalloffStart = 100; // Distance in meters where volume starts decreasing

// Speaker icon settings
const speakerIconSize = 40;
const speakerIconMargin = 20;

function preload() {
    // Load sound
    sound2 = loadSound('assets/Work It by Sköne.wav');
    sound2.amp(0.3);

    // Load user icon
    user = loadImage('assets/user2.png');
    
    // Load speaker icons
    speakerLoudIcon = loadImage('assets/speaker-loud.svg');
    speakerQuietIcon = loadImage('assets/speaker-quiet.svg');
}

function setup() { 
    // Create canvas overlay
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '999');
    canvas.position(0, 0);
    canvas.style('pointer-events', 'none');

    // Initialize map
    map = L.map('mapid').setView([userLat, userLng], 15);
    
    // Create Macadam icon
    const macadamIcon = L.icon({
        iconUrl: 'assets/macadam.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create warehouse icon
    const warehouseIcon = L.icon({
        iconUrl: 'assets/warehouse.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Le Floride icon
    const leflorideIcon = L.icon({
        iconUrl: 'assets/lefloride.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Colors Club icon
    const colorsclubIcon = L.icon({
        iconUrl: 'assets/user.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Stereolux icon
    const stereoluxIcon = L.icon({
        iconUrl: 'assets/stereolux.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Elephant Club icon
    const elephantclubIcon = L.icon({
        iconUrl: 'assets/elephantclub.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Bootlegger icon
    const bootleggerIcon = L.icon({
        iconUrl: 'assets/bootlegger.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create 19:33 Cocktail Experience icon
    const cocktailexpIcon = L.icon({
        iconUrl: 'assets/cocktailexp.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Le Lieu Unique icon
    const lieuuniqueIcon = L.icon({
        iconUrl: 'assets/lieuunique.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Zénith icon
    const zenithIcon = L.icon({
        iconUrl: 'assets/zenith.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Add map tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    // Add markers
    L.marker([warehouseLat, warehouseLng], {icon: warehouseIcon}).addTo(map)
        .bindPopup('Warehouse.<br> Carte.')
        .openPopup();

    L.marker([colorsclubLat, colorsclubLng], {icon: colorsclubIcon}).addTo(map)
        .bindPopup('Colors Club.<br> Carte.')
        .openPopup();

    L.marker([macadamLat, macadamLng], {icon: macadamIcon}).addTo(map)
        .bindPopup('<h2>Macadam</h2> 📍 21 Quai des Antilles. <br> Le temple de l\'électro à Nantes. Classé parmi les meilleurs clubs du monde, il accueille des DJ internationaux dans une ambiance industrielle et immersive.')
        .openPopup();

    L.marker([leflorideLat, leflorideLng], {icon: leflorideIcon}).addTo(map)
        .bindPopup('<h2>Le Floride</h2> 📍 21 Quai des Antilles. <br> Le temple de l\'électro à Nantes. Classé parmi les meilleurs clubs du monde, il accueille des DJ internationaux dans une ambiance industrielle et immersive.')
        .openPopup();

    L.marker([stereoluxLat, stereoluxLng], {icon: stereoluxIcon}).addTo(map)
        .bindPopup('<h2>Stereolux</h2> 📍 4 Boulevard Léon Bureau <br> Lieu dédié aux musiques actuelles et aux arts numériques. Programmation variée allant du rock à l\'électro, dans une ambiance créative et innovante.')
        .openPopup();

    L.marker([elephantclubLat, elephantclubLng], {icon: elephantclubIcon}).addTo(map)
        .bindPopup('<h2>Elephant Club</h2> 📍 10 Place de la Bourse <br> Ambiance mature et élégante pour les amateurs de musique généraliste. Idéal pour une soirée dansante entre amis dans un cadre soigné.')
        .openPopup();

    L.marker([bootleggerLat, bootleggerLng], {icon: bootleggerIcon}).addTo(map)
        .bindPopup('<h2>Bootlegger</h2> 📍 13 Rue Kervégan <br> Bar à cocktails inspiré de l\'époque de la prohibition. Ambiance feutrée et tamisée, parfaite pour savourer des créations originales.')
        .openPopup();

    L.marker([cocktailexpLat, cocktailexpLng], {icon: cocktailexpIcon}).addTo(map)
        .bindPopup('<h2>19:33 Cocktail Experience</h2> 📍 6 Rue Santeuil <br> Voyage dans le temps avec une déco style Orient Express. Cocktails du monde entier servis dans une atmosphère élégante et raffinée.')
        .openPopup();

    L.marker([lieuuniqueLat, lieuuniqueLng], {icon: lieuuniqueIcon}).addTo(map)
        .bindPopup('<h2>Le Lieu Unique</h2> 📍 2 Rue de la Biscuiterie <br> Ancienne usine LU transformée en centre culturel. Bar-restaurant avec une programmation artistique éclectique et une ambiance arty.')
        .openPopup();

    L.marker([zenithLat, zenithLng], {icon: zenithIcon}).addTo(map)
        .bindPopup('<h2>Zénith Nantes Métropole</h2> 📍 Boulevard du Zénith, Saint-Herblain <br> Grande salle accueillant des concerts de tous genres : pop, rock, hip-hop, variétés. Ambiance spectaculaire pour des événements d\'envergure.')
        .openPopup();
    
    // Make canvas transparent
    clear();
    
    // Add map event listeners
    map.on('move', updateUserPosition);
    map.on('zoom', updateUserPosition);

    sound2.setLoop(true);
}

function draw() {
    // Clear canvas
    clear();
    
    // Update user coordinates to follow cursor
    const newLatLng = map.containerPointToLatLng([mouseX, mouseY]);
    userLat = newLatLng.lat;
    userLng = newLatLng.lng;
    
    // Check proximity to Macadam and manage sound
    checkProximityToMacadam();
    
    // Get screen position of user
    const userPoint = map.latLngToContainerPoint([userLat, userLng]);
    const userX = userPoint.x;
    const userY = userPoint.y;
    
    // Draw user icon
    imageMode(CENTER);
    image(user, userX, userY, userSize, userSize);
    
    // Update sound playing status
    updateSoundStatus();
    
    // Draw speaker icon
    drawSpeakerIcon();
    
    // Hide cursor
    noCursor();
}

function updateUserPosition() {
    redraw();
}

// Calculate volume based on distance
function calculateVolumeFromDistance(distance) {
    if (distance >= proximityThreshold) {
        return 0; // No sound beyond threshold
    } else if (distance <= volumeFalloffStart) {
        return maxVolume; // Maximum volume when very close
    } else {
        // Linear interpolation between min and max volume
        const volumeRange = maxVolume - minVolume;
        const distanceRatio = (proximityThreshold - distance) / (proximityThreshold - volumeFalloffStart);
        return minVolume + (distanceRatio * volumeRange);
    }
}

function checkProximityToMacadam() {
    // Calculate distance to Macadam (in meters)
    const distance = getDistanceFromLatLonInM(userLat, userLng, macadamLat, macadamLng);
    
    // Calculate volume based on distance
    const volume = calculateVolumeFromDistance(distance);
    
    // Check if user is within proximity threshold of Macadam
    if (distance < proximityThreshold) {
        // If just entered proximity zone or already in zone
        if (!isNearMacadam) {
            console.log(`Near Macadam! Distance: ${distance.toFixed(0)}m, Volume: ${volume.toFixed(2)}`);
            
            if (!sound2.isPlaying()) {
                sound2.play();
            }
            isNearMacadam = true;
        }
        
        // Update volume dynamically based on distance
        sound2.amp(volume);
        
        // Optional: log volume changes at certain intervals for debugging
        if (frameCount % 60 === 0) { // Log once per second (assuming 60fps)
            console.log(`Distance: ${distance.toFixed(0)}m, Volume: ${volume.toFixed(2)}`);
        }
    } else if (isNearMacadam) {
        // If just left proximity zone
        console.log("Left Macadam proximity zone");
        isNearMacadam = false;
        sound2.pause();
    }
}

// Update the sound playing status
function updateSoundStatus() {
    isSoundPlaying = sound2.isPlaying();
}

// Draw the appropriate speaker icon based on sound status
function drawSpeakerIcon() {
    imageMode(CORNER);
    const rightCornerX = windowWidth - speakerIconSize - speakerIconMargin;
    
    if (isSoundPlaying) {
        image(speakerLoudIcon, rightCornerX, speakerIconMargin, speakerIconSize, speakerIconSize);
    } else {
        image(speakerQuietIcon, rightCornerX, speakerIconMargin, speakerIconSize, speakerIconSize);
    }
}

// Calculate distance between two points in meters
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
