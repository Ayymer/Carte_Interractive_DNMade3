// Sound variables
let sound2;

// Geographic coordinates for the user
let userLat = 47.216671;
let userLng = -1.55;

// UI elements
let userSize = 40;
let isNearMacadam = false;
let user, map, canvas;
let speakerLoudIcon, speakerQuietIcon;
let isSoundPlaying = false;

// Macadam marker coordinates
const macadamLat = 47.19750561442489;
const macadamLng = -1.5891794806023196;
const proximityThreshold = 1000; // Distance in meters to trigger sound

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
    user = loadImage('assets/user.png');
    
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
        iconSize: [45, 45],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    // Add map tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
    }).addTo(map);

    // Add markers
    L.marker([userLat, userLng]).addTo(map)
        .bindPopup('Nantes.<br> Carte.')
        .openPopup();

    L.marker([47.201316327544696, -1.5728756262744052]).addTo(map)
        .bindPopup('Ware.<br> Carte.')
        .openPopup();

    L.marker([macadamLat, macadamLng], {icon: macadamIcon}).addTo(map)
        .bindPopup('Macadam.')
        .openPopup();
    
    // Make canvas transparent
    clear();
    
    // Add map event listeners
    map.on('move', updateUserPosition);
    map.on('zoom', updateUserPosition);

    sound2.setLoop(true)
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
