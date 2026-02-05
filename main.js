const countrySelect = document.getElementById('country-select');
const itineraryContainer = document.getElementById('itinerary-container');
const generateButton = document.getElementById('generate-button');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const interestSelect = document.getElementById('interest-select');

function populateCountries() {
    popularCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

function generateItinerary(country, days, interest) {
    itineraryContainer.innerHTML = '';
    if (!country || !days || days <= 0) {
        itineraryContainer.innerHTML = '<p>Please select a country and a valid date range.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('itinerary-table');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Day</th>
            <th>Activity</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let i = 1; i <= days; i++) {
        const row = document.createElement('tr');
        const activity = getActivityForDay(i, country, interest);
        row.innerHTML = `
            <td>Day ${i}</td>
            <td>${activity}</td>
        `;
        tbody.appendChild(row);
    }
    table.appendChild(tbody);

    itineraryContainer.appendChild(table);
}

function getActivityForDay(day, country, interest) {
    // Mock "scraping"
    const activities = {
        'shopping': `Go shopping for souvenirs at the local market in ${country}.`,
        'dining': `Enjoy a traditional dinner at a highly-rated restaurant in ${country}.`,
        'sightseeing': `Visit the most famous landmark in ${country}.`
    };

    let activity = activities[interest] || `Explore the city of ${country}.`;

    return `${activity}`;
}


generateButton.addEventListener('click', () => {
    const selectedCountry = countrySelect.value;
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const selectedInterest = interestSelect.value;

    if (startDate && endDate && startDate <= endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        generateItinerary(selectedCountry, days, selectedInterest);
    } else {
        itineraryContainer.innerHTML = '<p>Please select a valid start and end date.</p>';
    }
});


populateCountries();
