const countryApi = async () => {
    try {
        const getData = await fetch('data.json');
        const data = await getData.json();
        console.log(data);

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const createCountryDiv = (countries) => {
    const countriesContainer = document.getElementById('displayCountries');
    countriesContainer.innerHTML = '';

    countries.forEach(country => {
        const formattedPopulation = country.population.toLocaleString();

        const countryDiv = document.createElement('div');
        countryDiv.className = 'country';

        countryDiv.innerHTML = `
            <div class="flag" id="openDetails">
                <img src="${country.flags.png}" alt="flag">
            </div>
            <div class="data">
                <h1 class="name">${country.name}</h1>
                <div class="info">
                    <p class="population">Population: <span>${formattedPopulation}</span></p>
                    <p class="region">Region: <span>${country.region}</span></p>
                    <p class="capital">Capital: <span>${country.capital || 'N/A'}</span></p>
                </div>
            </div>
        `;

        const flagElement = countryDiv.querySelector('.flag');
        makeElementLink(flagElement, `details.html?country=${encodeURIComponent(country.name)}`);

        countriesContainer.appendChild(countryDiv);
    });
};

const makeElementLink = (element, url) => {
    if (!element || !url) return;

    element.addEventListener('click', () => {
        window.location.href = url;
    });
}



const filterBtn = document.getElementById('filterBtn');
const filterDropDown = document.getElementById('filterList');
const dropDownCountry = document.querySelectorAll('.filterItem');
const filterText = document.getElementById('filtertext');

filterBtn.addEventListener('click', () => {
    const displayVal = getComputedStyle(filterDropDown).getPropertyValue('display');
    filterDropDown.style.display = displayVal === 'none' ? 'flex' : 'none';
});

document.addEventListener('click', (event) => {
    if (!event.target.closest(".filter")) {
        filterDropDown.style.display = 'none';
    }
});

dropDownCountry.forEach((region) => {
    region.addEventListener('click', async (select) => {
        const selectedRegion = select.target.textContent.trim();
        filterText.textContent = selectedRegion;

        const data = await countryApi();
        const filteredCountries = data.filter(country => country.region === selectedRegion);

        createCountryDiv(filteredCountries);
        filterDropDown.style.display = 'none';
    });
});

const initialize = async () => {
    const data = await countryApi();
    createCountryDiv(data);
};

initialize();

const searchCountry = async (event) => {
    if (event) event.preventDefault(); // Prevent form or button default behavior.

    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const data = await countryApi();

    const searchResult = data.filter(country =>
        country.name.toLowerCase().includes(searchInput)
    );

    const countriesContainer = document.getElementById('displayCountries');

    if (searchResult.length > 0) {
        createCountryDiv(searchResult);
    } else {
        countriesContainer.innerHTML = '<p class="error">404 Country not Found</p>';
    }
};

document.getElementById('searchBtn').addEventListener('click', (event) => searchCountry(event));


// ---------------------------detailsPage-------------------------


const openDetails = document.getElementById('openDetails');




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

