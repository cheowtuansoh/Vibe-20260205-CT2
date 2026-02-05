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

function displayItinerary(country, days, itinerary) {
    itineraryContainer.innerHTML = `<h2>Your ${country} Itinerary for ${days} Days</h2>`;
    const table = document.createElement('table');
    table.classList.add('itinerary-table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const dayHeader = document.createElement('th');
    dayHeader.textContent = 'Day';
    const activityHeader = document.createElement('th');
    activityHeader.textContent = 'Activity';
    headerRow.appendChild(dayHeader);
    headerRow.appendChild(activityHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();
    itinerary.dailyActivities.forEach((activity, index) => {
        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = `Day ${index + 1}`;
        const activityCell = document.createElement('td');
        activityCell.textContent = activity;
        row.appendChild(dayCell);
        row.appendChild(activityCell);
        fragment.appendChild(row);
    });
    tbody.appendChild(fragment);
    table.appendChild(tbody);
    itineraryContainer.appendChild(table);
}

async function generateItinerary(country, days, interest) {
    itineraryContainer.innerHTML = '<h2>Generating your itinerary...</h2><p>Please wait, this might take a moment.</p>';

    if (!days || days <= 0) {
        itineraryContainer.innerHTML = '<p>Please select a valid date range.</p>';
        return;
    }

    try {
        const dailyActivities = [];
        let availableActivities = [];

        if (recommendations[country] && recommendations[country][interest]) {
            // Create a copy to avoid modifying the original recommendations
            availableActivities = [...recommendations[country][interest]];
        }

        for (let i = 0; i < days; i++) {
            dailyActivities.push(getActivityForDay(i + 1, country, interest, availableActivities));
        }
        const itinerary = { dailyActivities };

        displayItinerary(country, days, itinerary);

    } catch (error) {
        console.error('Error generating itinerary:', error);
        itineraryContainer.innerHTML = `<p style="color: red;">Error: ${error.message}. Please try again.</p>`;
    }
}

function getActivityForDay(day, country, interest, availableActivities) {
    if (availableActivities.length > 0) {
        const activitiesForDay = [];
        const count = Math.min(availableActivities.length, 2);

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * availableActivities.length);
            const selectedActivity = availableActivities.splice(randomIndex, 1)[0];
            activitiesForDay.push(selectedActivity);
        }

        return activitiesForDay.join(' and ');
    } else {
        // Fallback for countries or interests not in our recommendations
        const activities = {
            'shopping': `Go shopping for souvenirs at the local market in ${country}.`,
            'dining': `Enjoy a traditional dinner at a highly-rated restaurant in ${country}.`,
            'sightseeing': `Visit the most famous landmark in ${country}.`
        };
        return activities[interest] || `Explore the city of ${country}.`;
    }
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
