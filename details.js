const countryDetailsApi = async (countryName) => {
    try {
        const getData = await fetch('data.json');
        const data = await getData.json();

        const country = data.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        return country;
    } catch (error) {
        console.error("Error fetching country details:", error);
        return null;
    }
};

const displayCountryDetails = (country) => {
    const detailsContainer = document.getElementById('detail-container');

    if (country) {
        const formattedPopulation = country.population.toLocaleString();

        detailsContainer.innerHTML = `
            <div class="flag-side">
                <img src="${country.flags.png}" alt="${country.name} flag">
            </div>
            <div class="maindetails">
                <h1 class="big-name">${country.name}</h1>
                <div class="detailed-data">
                    <div class="detail-left">
                        <p>Native Name: <span>${country.nativeName}</span></p>
                        <p>Population: <span>${formattedPopulation}</span></p>
                        <p>Region: <span>${country.region}</span></p>
                        <p>Sub Region: <span>${country.subregion}</span></p>
                        <p>Capital: <span>${country.capital || 'N/A'}</span></p>
                    </div>
                    <div class="detail-right">
                        <p>Top Level Domain: <span>${country.topLevelDomain[0]}</span></p>
                        <p>Currencies: <span>${country.currencies.map(currency => currency.name).join(', ')}</span></p>
                        <p>Languages: <span>${country.languages ? country.languages.map(language => language.name).join(', ') : 'N/A'}</span></p>
                    </div>
                </div>
                <div class="border-countries">
                    <p>Border Countries: </p>
                    <div class="border-list" id="countryList"></div>
                </div>
            </div>
        `;
        if (country.borders && country.borders.length > 0) {
            createBorderCountries(country.borders);
        } else {
            const countryListContainer = document.getElementById('countryList');
            countryListContainer.innerHTML = '<p>No border countries available.</p>';
        }
    } else {
        detailsContainer.innerHTML = '<p>Country details not found.</p>';
    }
};

const countryApi = async () => {
    try {
        const getData = await fetch('data.json');
        const data = await getData.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const createBorderCountries = async (abbreviations) => {
    const countries = await countryApi();

    const borderCountries = abbreviations
        .map(abbreviation => {
            const matchedCountry = countries.find(country => country.alpha3Code === abbreviation);
            return matchedCountry ? matchedCountry.name : null;
        })
        .filter(name => name !== null);

    const countryListContainer = document.getElementById('countryList');
    countryListContainer.innerHTML = borderCountries.length
        ? borderCountries.map(name => `<p>${name}</p>`).join('')
        : '<p>No border countries available.</p>';
};

const getCountryFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const countryName = urlParams.get('country');
    return countryName;
};

const initialize = async () => {
    const countryName = getCountryFromURL();

    if (countryName) {
        const country = await countryDetailsApi(countryName);
        displayCountryDetails(country);
    } else {
        console.error("No country parameter found in URL.");
    }
};

initialize();

// -------light and dark mode-----------------

const root = document.documentElement;
const themeSwitchIcon = document.getElementById('theme-switch');

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const savedIcon = localStorage.getItem('iconState');

    if (savedTheme) {
        root.classList.add(savedTheme);
    }

    if (savedIcon === 'fa-solid') {
        themeSwitchIcon.classList.add('fa-solid');
        themeSwitchIcon.classList.remove('fa-regular');
    } else {
        themeSwitchIcon.classList.add('fa-regular');
        themeSwitchIcon.classList.remove('fa-solid');
    }
});

const toggleTheme = () => {
    if (root.classList.contains('dark-theme')) {
        root.classList.remove('dark-theme');
        localStorage.setItem('theme', '');
        themeSwitchIcon.classList.add('fa-regular');
        themeSwitchIcon.classList.remove('fa-solid');
        localStorage.setItem('iconState', 'fa-regular');
    } else {
        root.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        themeSwitchIcon.classList.add('fa-solid');
        themeSwitchIcon.classList.remove('fa-regular');
        localStorage.setItem('iconState', 'fa-solid');
    }
};

document.getElementById('mode-switcher').addEventListener('click', toggleTheme);
