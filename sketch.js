// Sound variables
let sounds = {};

// Geographic coordinates for the user
let userLat = 47.216671;
let userLng = -1.55;

// UI elements
let userSize = 80;
let user, map, canvas;
let speakerLoudIcon;
let isSoundPlaying = false;

// Proximity settings
const proximityThreshold = 500; // Distance in meters to trigger sound

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

// Define venues array with all locations
const venues = [
    { name: "Macadam", lat: macadamLat, lng: macadamLng, isNear: false, soundFile: 'MACADAM.mp3' },
    { name: "Warehouse", lat: warehouseLat, lng: warehouseLng, isNear: false, soundFile: 'WAREHOUSE.mp3' },
    { name: "Le Floride", lat: leflorideLat, lng: leflorideLng, isNear: false, soundFile: 'FLORIDE.mp3' },
    { name: "Colors Club", lat: colorsclubLat, lng: colorsclubLng, isNear: false, soundFile: 'COLORS.mp3' },
    { name: "Stereolux", lat: stereoluxLat, lng: stereoluxLng, isNear: false, soundFile: 'STEREOLUX.mp3' },
    { name: "Elephant Club", lat: elephantclubLat, lng: elephantclubLng, isNear: false, soundFile: 'elephant_club.mp3' },
    { name: "Bootlegger", lat: bootleggerLat, lng: bootleggerLng, isNear: false, soundFile: 'BOOTLEGGER.mp3' },
    { name: "19:33 Cocktail Experience", lat: cocktailexpLat, lng: cocktailexpLng, isNear: false, soundFile: 'cocktail.mp3' },
    { name: "Le Lieu Unique", lat: lieuuniqueLat, lng: lieuuniqueLng, isNear: false, soundFile: 'lelieuunique.mp3' },
    { name: "Zénith Nantes Métropole", lat: zenithLat, lng: zenithLng, isNear: false, soundFile: 'ZENITH.mp3' }
];

// Sound settings
const maxVolume = 0.6; // Maximum volume level
const minVolume = 0.05; // Minimum volume when at threshold distance
const volumeFalloffStart = 100; // Distance in meters where volume starts decreasing

// Speaker icon settings
const speakerIconSize = 40;
const speakerIconMargin = 20;

// Add frame rate control
let lastFrameTime = 0;
const targetFrameRate = 30; // Limit to 30 FPS for better performance
const frameInterval = 1000 / targetFrameRate;

function preload() {
    // Load all sounds
    venues.forEach(venue => {
        sounds[venue.name] = loadSound(`assets/sounds/${venue.soundFile}`, 
            // Success callback
            () => {
                console.log(`Sound loaded successfully for ${venue.name}`);
                venue.sound = sounds[venue.name];
                venue.sound.amp(0.3);
                venue.sound.setLoop(true);
            },
            // Error callback
            (err) => {
                console.error(`Error loading sound for ${venue.name}:`, err);
            }
        );
    });

    // Load user icon
    user = loadImage('assets/icons/user2.png');
    
    // Load speaker icon
    speakerLoudIcon = loadImage('assets/icons/speaker-loud.svg',
        // Success callback
        () => {
            console.log('Speaker icon loaded successfully');
        },
        // Error callback
        (err) => {
            console.error('Error loading speaker icon:', err);
        }
    );
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
        iconUrl: 'assets/icons/macadam.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create warehouse icon
    const warehouseIcon = L.icon({
        iconUrl: 'assets/icons/warehouse.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Le Floride icon
    const leflorideIcon = L.icon({
        iconUrl: 'assets/icons/le_floride.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Colors Club icon
    const colorsclubIcon = L.icon({
        iconUrl: 'assets/icons/color_club.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Stereolux icon
    const stereoluxIcon = L.icon({
        iconUrl: 'assets/icons/stereolux.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Elephant Club icon
    const elephantclubIcon = L.icon({
        iconUrl: 'assets/icons/elephant_club.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Bootlegger icon
    const bootleggerIcon = L.icon({
        iconUrl: 'assets/icons/bootlegger.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create 19:33 Cocktail Experience icon
    const cocktailexpIcon = L.icon({
        iconUrl: 'assets/icons/cocktail_xp.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Le Lieu Unique icon
    const lieuuniqueIcon = L.icon({
        iconUrl: 'assets/icons/lelieuunique.png',
        iconSize: [60, 60],
        iconAnchor: [30, 30],
        popupAnchor: [0, -15],
        className: 'rounded-icon',
    });

    // Create Zénith icon
    const zenithIcon = L.icon({
        iconUrl: 'assets/icons/zenith.png',
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
    L.marker([warehouseLat, warehouseLng], {
        icon: warehouseIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('Warehouse.<br> Carte.');

    L.marker([colorsclubLat, colorsclubLng], {
        icon: colorsclubIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('Colors Club.<br> Carte.');

    L.marker([macadamLat, macadamLng], {
        icon: macadamIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Macadam</h2> 📍 21 Quai des Antilles. <br> Le temple de l\'électro à Nantes. Classé parmi les meilleurs clubs du monde, il accueille des DJ internationaux dans une ambiance industrielle et immersive.');

    L.marker([leflorideLat, leflorideLng], {
        icon: leflorideIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Le Floride</h2> 📍 21 Quai des Antilles. <br> Le temple de l\'électro à Nantes. Classé parmi les meilleurs clubs du monde, il accueille des DJ internationaux dans une ambiance industrielle et immersive.');

    L.marker([stereoluxLat, stereoluxLng], {
        icon: stereoluxIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Stereolux</h2> 📍 4 Boulevard Léon Bureau <br> Lieu dédié aux musiques actuelles et aux arts numériques. Programmation variée allant du rock à l\'électro, dans une ambiance créative et innovante.');

    L.marker([elephantclubLat, elephantclubLng], {
        icon: elephantclubIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Elephant Club</h2> 📍 10 Place de la Bourse <br> Ambiance mature et élégante pour les amateurs de musique généraliste. Idéal pour une soirée dansante entre amis dans un cadre soigné.');

    L.marker([bootleggerLat, bootleggerLng], {
        icon: bootleggerIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Bootlegger</h2> 📍 13 Rue Kervégan <br> Bar à cocktails inspiré de l\'époque de la prohibition. Ambiance feutrée et tamisée, parfaite pour savourer des créations originales.');

    L.marker([cocktailexpLat, cocktailexpLng], {
        icon: cocktailexpIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>19:33 Cocktail Experience</h2> 📍 6 Rue Santeuil <br> Voyage dans le temps avec une déco style Orient Express. Cocktails du monde entier servis dans une atmosphère élégante et raffinée.');

    L.marker([lieuuniqueLat, lieuuniqueLng], {
        icon: lieuuniqueIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Le Lieu Unique</h2> 📍 2 Rue de la Biscuiterie <br> Ancienne usine LU transformée en centre culturel. Bar-restaurant avec une programmation artistique éclectique et une ambiance arty.');

    L.marker([zenithLat, zenithLng], {
        icon: zenithIcon,
        riseOnHover: true
    }).addTo(map)
        .bindPopup('<h2>Zénith Nantes Métropole</h2> 📍 Boulevard du Zénith, Saint-Herblain <br> Grande salle accueillant des concerts de tous genres : pop, rock, hip-hop, variétés. Ambiance spectaculaire pour des événements d\'envergure.');

    // Make canvas transparent
    clear();
    
    // Add map event listeners
    map.on('move', updateUserPosition);
    map.on('zoom', updateUserPosition);
}

function draw() {
    // Frame rate control
    const currentTime = millis();
    if (currentTime - lastFrameTime < frameInterval) {
        return;
    }
    lastFrameTime = currentTime;

    // Clear canvas
    clear();
    
    // Only update coordinates if mouse has moved
    if (mouseX !== pmouseX || mouseY !== pmouseY) {
        const newLatLng = map.containerPointToLatLng([mouseX, mouseY]);
        userLat = newLatLng.lat;
        userLng = newLatLng.lng;
        
        // Check proximity to all venues and manage sound
        checkProximityToVenues();
    }
    
    // Get screen position of user
    const userPoint = map.latLngToContainerPoint([userLat, userLng]);
    const userX = userPoint.x;
    const userY = userPoint.y;
    
    // Draw user icon
    imageMode(CENTER);
    image(user, userX, userY, userSize, userSize);
    
    // Draw speaker icons on active markers
    venues.forEach(venue => {
        if (venue.isNear) {
            const markerPoint = map.latLngToContainerPoint([venue.lat, venue.lng]);
            imageMode(CENTER);
            image(speakerLoudIcon, markerPoint.x, markerPoint.y - 40, 20, 20);
        }
    });
    
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

// Optimize proximity checking
function checkProximityToVenues() {
    // Find the closest venue
    let closestVenue = null;
    let closestDistance = Infinity;
    
    // Calculate distances to all venues
    for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        const distance = getDistanceFromLatLonInM(userLat, userLng, venue.lat, venue.lng);
        
        // Only store distance if it's within threshold
        if (distance < proximityThreshold) {
            venue.distance = distance;
            
            // Check if this is the closest venue
            if (distance < closestDistance) {
                closestVenue = venue;
                closestDistance = distance;
            }
        } else {
            // Clear distance if outside threshold
            venue.distance = null;
        }
    }
    
    // Handle the closest venue (if any)
    if (closestVenue) {
        // Calculate volume based on distance
        const volume = calculateVolumeFromDistance(closestDistance);
        
        // If we just entered this venue's proximity
        if (!closestVenue.isNear) {
            console.log(`Near ${closestVenue.name}! Distance: ${closestDistance.toFixed(0)}m, Volume: ${volume.toFixed(2)}`);
            
            // Stop sounds from other venues
            for (let i = 0; i < venues.length; i++) {
                const v = venues[i];
                if (v !== closestVenue && v.isNear) {
                    v.isNear = false;
                    if (v.sound && v.sound.isPlaying()) {
                        v.sound.pause();
                    }
                }
            }
            
            // Start playing if not already
            if (closestVenue.sound && !closestVenue.sound.isPlaying()) {
                closestVenue.sound.play();
            }
            
            closestVenue.isNear = true;
        }
        
        // Update volume dynamically based on distance
        if (closestVenue.sound) {
            closestVenue.sound.amp(volume);
        }
        
        // Optional: log volume changes at certain intervals for debugging
        if (frameCount % 60 === 0) { // Log once per second (assuming 60fps)
            console.log(`Near ${closestVenue.name}: Distance: ${closestDistance.toFixed(0)}m, Volume: ${volume.toFixed(2)}`);
        }
    } else {
        // If not near any venue, stop all sounds
        let wasNearAny = false;
        
        for (let i = 0; i < venues.length; i++) {
            const venue = venues[i];
            if (venue.isNear) {
                wasNearAny = true;
                venue.isNear = false;
                if (venue.sound && venue.sound.isPlaying()) {
                    venue.sound.pause();
                }
            }
        }
        
        if (wasNearAny) {
            console.log("Left all venue proximity zones");
        }
    }
    
    // Update sound playing status
    isSoundPlaying = venues.some(venue => venue.sound && venue.sound.isPlaying());
}

// Update the sound playing status
function updateSoundStatus() {
    isSoundPlaying = sound2.isPlaying();
}

// Optimize distance calculation
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
