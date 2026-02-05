const countrySelect = document.getElementById('country-select');
const itineraryContainer = document.getElementById('itinerary-container');
const generateButton = document.getElementById('generate-button');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const interestSelect = document.getElementById('interest-select');

function populateCountries() {
    const fragment = document.createDocumentFragment();
    popularCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        fragment.appendChild(option);
    });
    countrySelect.appendChild(fragment);
}

function generateItinerary(country, days, interest) {
    itineraryContainer.innerHTML = '';
    // Removed !country check as it's validated in the event listener
    if (!days || days <= 0) {
        itineraryContainer.innerHTML = '<p>Please select a valid date range.</p>';
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
    const fragment = document.createDocumentFragment(); // Use DocumentFragment
    for (let i = 1; i <= days; i++) {
        const row = document.createElement('tr');
        const activity = getActivityForDay(i, country, interest);
        row.innerHTML = `
            <td>Day ${i}</td>
            <td>${activity}</td>
        `;
        fragment.appendChild(row); // Append to fragment
    }
    tbody.appendChild(fragment); // Append fragment to tbody once
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
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;
    const selectedInterest = interestSelect.value;

    // Validate required fields in order: Country, Start Date, End Date
    if (!selectedCountry) {
        alert('Please choose a country first.');
        return;
    }
    if (!startDateValue) {
        alert('Please select a Start Date next.');
        return;
    }
    if (!endDateValue) {
        alert('Please select an End Date.');
        return;
    }

    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    // Validate date range
    if (startDate > endDate) {
        alert('Start date cannot be after end date. Please select a valid date range.');
        return;
    }

    if (startDate && endDate && startDate <= endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        generateItinerary(selectedCountry, days, selectedInterest);
    }
});


populateCountries();
