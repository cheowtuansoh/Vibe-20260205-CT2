const countrySelect = document.getElementById('country-select');
const itineraryContainer = document.getElementById('itinerary-container');

function populateCountries() {
    popularCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

function generateItinerary(countryName) {
    itineraryContainer.innerHTML = '';
    if (!countryName) return;

    const itinerary = {
        name: countryName,
        days: [
            { day: 1, title: `Arrival in ${countryName}`, description: `Arrive and check into your accommodation. Take some time to explore the immediate surroundings of your hotel.` },
            { day: 2, title: "City Exploration", description: `Visit the capital city's main attractions. This could include museums, historical sites, and local markets.` },
            { day: 3, title: "Cultural Immersion", description: `Experience the local culture by visiting a traditional village, attending a cultural performance, or taking a cooking class.` },
            { day: 4, title: "Natural Wonders", description: `Explore the natural beauty of ${countryName}. This could be a national park, a scenic viewpoint, or a relaxing day at the beach.` },
            { day: 5, title: "Adventure Day", description: `Engage in an adventurous activity like hiking, zip-lining, or water sports, depending on the local offerings.` },
            { day: 6, title: "Departure", description: `Enjoy a final breakfast in ${countryName} and head to the airport for your departure.` },
        ]
    };

    itinerary.days.forEach(day => {
        const item = document.createElement('div');
        item.classList.add('itinerary-item');
        item.innerHTML = `
            <h2>Day ${day.day}: ${day.title}</h2>
            <p>${day.description}</p>
        `;
        itineraryContainer.appendChild(item);
    });
}

countrySelect.addEventListener('change', (e) => {
    generateItinerary(e.target.value);
});

populateCountries();
