// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for future mobile navigation)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                try {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } catch (error) {
                    // Fallback for browsers that don't support smooth scrolling
                    target.scrollIntoView();
                }
            }
        });
    });
    
    // Skill dropdown functionality
    const skillDropdowns = document.querySelectorAll('.skill-item-dropdown');
    
    skillDropdowns.forEach(dropdown => {
        const header = dropdown.querySelector('.skill-header');
        
        header.addEventListener('click', function() {
            // Close other dropdowns
            skillDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });
    
    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(26, 26, 26, 0.95)';
            } else {
                nav.style.background = '#1a1a1a';
            }
        }
    });

    // Initialize API demo functionality
    initializeAPIDemo();
});

// API Demo Functions
let is12HourFormat = false;
let isFahrenheit = false;
let currentWeatherData = null;

function initializeAPIDemo() {
    // Start displaying time immediately and update every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Fetch weather data
    fetchWeatherData();
    
    // Update weather every 10 minutes
    setInterval(fetchWeatherData, 600000);
    
    // Add click event listeners for toggling
    setupToggleListeners();
}

function setupToggleListeners() {
    // Toggle time format on click
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.style.cursor = 'pointer';
        timeDisplay.addEventListener('click', function() {
            is12HourFormat = !is12HourFormat;
            updateTime();
        });
    }
    
    // Toggle temperature unit on click
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (weatherDisplay) {
        weatherDisplay.style.cursor = 'pointer';
        weatherDisplay.addEventListener('click', function() {
            isFahrenheit = !isFahrenheit;
            updateWeatherDisplay();
        });
    }
}

// Helsinki Time Display
function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;
    
    try {
        const now = new Date();
        const helsinkiTime = new Intl.DateTimeFormat('en-FI', {
            timeZone: 'Europe/Helsinki',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: is12HourFormat
        }).format(now);
        
        const date = new Intl.DateTimeFormat('en-FI', {
            timeZone: 'Europe/Helsinki',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(now);
        
        timeDisplay.innerHTML = `
            <div style="font-size: 1.2em; font-weight: 600; color: #007bff;">${helsinkiTime}</div>
            <div style="font-size: 0.9em; color: #b0b0b0; margin-top: 4px;">${date}</div>
            <div style="font-size: 0.8em; color: #666; margin-top: 2px;">Click to toggle format</div>
        `;
    } catch (error) {
        console.error('Error updating time:', error);
        timeDisplay.innerHTML = '<div style="color: #ff4757;">Time unavailable</div>';
    }
}

// Weather Data
async function fetchWeatherData() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (!weatherDisplay) return;
    
    try {
        const latitude = 63.3667;
        const longitude = 23.4833;
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Helsinki`
        );
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        currentWeatherData = data.current_weather;
        
        updateWeatherDisplay();
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        const weatherDisplay = document.getElementById('weatherDisplay');
        if (weatherDisplay) {
            weatherDisplay.innerHTML = '<div style="color: #ff4757;">Weather unavailable</div>';
        }
    }
}

function updateWeatherDisplay() {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (!weatherDisplay || !currentWeatherData) return;
    
    try {
        const weather = currentWeatherData;
        
        // Convert temperature
        let temperature = weather.temperature;
        let unit = '°C';
        
        if (isFahrenheit) {
            temperature = Math.round((temperature * 9/5) + 32);
            unit = '°F';
        } else {
            temperature = Math.round(temperature);
        }
        
        const weatherCode = weather.weathercode;
        const weatherDescription = getWeatherDescription(weatherCode);
        
        weatherDisplay.innerHTML = `
            <div style="font-size: 1.2em; font-weight: 600; color: #007bff;">${temperature}${unit}</div>
            <div style="font-size: 0.9em; color: #b0b0b0; margin-top: 4px;">${weatherDescription}</div>
            <div style="font-size: 0.8em; color: #666; margin-top: 2px;">Click to toggle unit</div>
        `;
        
    } catch (error) {
        console.error('Error updating weather display:', error);
        weatherDisplay.innerHTML = '<div style="color: #ff4757;">Weather unavailable</div>';
    }
}

// Convert weather code to description
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with heavy hail'
    };
    
    return weatherCodes[code] || 'Unknown';
}