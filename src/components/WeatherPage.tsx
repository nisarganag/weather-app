// src/components/WeatherPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface WeatherData {
    city: string;
    temperature: number;
    weather: string;
    // Add more weather data properties as needed
}

const WeatherPage: React.FC = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Fetch weather data for the city using an API (replace with actual API endpoint)
                const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${cityName}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setWeatherData({
                    city: data.location.name,
                    temperature: data.current.temp_c,
                    weather: data.current.condition.text,
                    // Add more weather data properties as needed
                });
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    if (!weatherData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Weather for {weatherData.city}</h1>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Weather: {weatherData.weather}</p>
            {/* Display more weather data */}
        </div>
    );
};

export default WeatherPage;
