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

async function generateItinerary(country, days, interest) {
    itineraryContainer.innerHTML = '<h2>Generating your itinerary...</h2><p>Please wait, this might take a moment.</p>';
    
    if (!days || days <= 0) {
        itineraryContainer.innerHTML = '<p>Please select a valid date range.</p>';
        return;
    }

    try {
        // const firebaseFunctionUrl = 'YOUR_FIREBASE_FUNCTION_URL/generateItinerary';
        // For now, let's use a client-side mock to avoid the error until the Firebase Function is deployed.

        // Mock itinerary generation
        const dailyActivities = [];
        for (let i = 0; i < days; i++) {
            dailyActivities.push(getActivityForDay(i + 1, country, interest));
        }
        const itinerary = { dailyActivities };
        
        // Display the generated itinerary
        itineraryContainer.innerHTML = `<h2>Your ${country} Itinerary for ${days} Days</h2>`;
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
        const fragment = document.createDocumentFragment(); 
        itinerary.dailyActivities.forEach((activity, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Day ${index + 1}</td>
                <td>${activity}</td>
            `;
            fragment.appendChild(row);
        });
        tbody.appendChild(fragment);
        table.appendChild(tbody);
        itineraryContainer.appendChild(table);

    } catch (error) {
        console.error('Error generating itinerary:', error);
        itineraryContainer.innerHTML = `<p style="color: red;">Error: ${error.message}. Please try again.</p>`;
    }
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
