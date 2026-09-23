const fs = require('fs');

const dbStr = fs.readFileSync('data/silveriom_db.json', 'utf8');
const db = JSON.parse(dbStr);

const eventsStr = fs.readFileSync('tournament-calendar/club_events.js', 'utf8');
// Mock window
const window = {};
eval(eventsStr);

const proposal = {
    cart: ['SVM-AZ-119'] // Azadi item
};

const inventory = db.mediaInventory || [];
const selectedMedias = proposal.cart.map(code => inventory.find(m => m.code === code || m.id === code)).filter(Boolean);
const selectedLocations = [...new Set(selectedMedias.map(m => m.location))];

console.log("Selected Locations:", selectedLocations);

const locMap = {
    'arena': ['arena'],
    'enghelab': ['enghelab'],
    't10': ['t10'],
    'ajudaniyeh': ['t10'],
    'netra': ['netra'],
    'kish': ['kish']
};

const eventLocIds = new Set();
selectedLocations.forEach(loc => {
    if (locMap[loc]) locMap[loc].forEach(id => eventLocIds.add(id));
});

console.log("eventLocIds:", Array.from(eventLocIds));

const eventsData = window.eventsData || [];
const filteredEvents = eventsData.filter(ev => eventLocIds.has(ev.locId));

console.log("Filtered Events Count:", filteredEvents.length);
if (filteredEvents.length > 0) {
    console.log("Events:", filteredEvents.map(e => e.name));
}
