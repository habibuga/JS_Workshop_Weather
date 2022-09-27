const apiKey = 'e0a4e5e86a284f9d9a6115907222609';
const apiHost = 'http://api.weatherapi.com/v1/forecast.json?key=';
const weekDays = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

function addSearchForm (event) {
    event.preventDefault();

    const searchForm = document.querySelector(".module__form");
    searchForm.removeAttribute('hidden');
}

function addCloseBtns () {
    const closeBtns = document.querySelectorAll('.btn--close');
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            if (btn.parentElement.classList.contains('module__weather')) {
                btn.parentElement.remove();
            } else {
                btn.parentElement.hidden = true;
            }
        })
    });
}

async function getWeather (event) {
    event.preventDefault();
    const searchCityInput = document.querySelector('#search');
    let selectedCity = 'auto:ip'

    if (searchCityInput.value !== '') {
        selectedCity = searchCityInput.value;
    }

    try {
        const response = await fetch(apiHost + apiKey + `&q=${selectedCity}&days=5`);
        const data = await response.json()

        console.log(data.location.name)
        console.log(data)

        const forecastTemp = document.querySelector('.module__weather');
        const forecastHTML = forecastTemp.cloneNode(true);
        forecastHTML.removeAttribute('hidden');

        // populate current weather
        const cityName = forecastHTML.querySelector('.city__name');
        cityName.innerText = data.location.name;
        const tempValue = forecastHTML.querySelector('.temperature__value');
        tempValue.innerText = data.current.temp_c;
        const pressureValue = forecastHTML.querySelector('.pressure__value');
        pressureValue.innerText = data.current.pressure_mb;
        const humidityValue = forecastHTML.querySelector('.humidity__value');
        humidityValue.innerText = data.current.humidity;
        const windSpeed = forecastHTML.querySelector('.wind-speed__value');
        windSpeed.innerText = data.current.wind_kph;
        const weatherIcon = forecastHTML.querySelector('.weather__icon');
        weatherIcon.firstElementChild.src = data.current.condition.icon;
        forecastTemp.parentNode.insertBefore(forecastHTML, forecastTemp.nextSibling);

        // populate forecast weather
        const forecastList = forecastHTML.querySelector('.weather__forecast');
        let i = 0;
        [...forecastList.childNodes].forEach((li) => {
            if (li.tagName === 'LI') {
                const weekDay = li.querySelector('.day');
                weekDay.innerText = weekDays[new Date(data.forecast.forecastday[i].date).getDay()];

                const weatherImg = li.querySelector('img');
                weatherImg.src = data.forecast.forecastday[i].day.condition.icon;

                const weatherTemp = li.querySelector('.temperature');
                weatherTemp.innerText = data.forecast.forecastday[i].day.avgtemp_c;

                i++
            }
        })

        addCloseBtns();

    } catch (error) {
        console.log(error);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const addCityBtn = document.querySelector("#add-city");
    const searchWeatherBtn = document.querySelector('.find-city :nth-child(2)')

    addCityBtn.addEventListener('click', addSearchForm);

    searchWeatherBtn.addEventListener('click', getWeather);

    addCloseBtns();
})


