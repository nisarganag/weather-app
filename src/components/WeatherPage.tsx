import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface WeatherData {
    city: string;
    temperature: number;
    weather: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    // Add more weather data properties as needed
}

const WeatherPage: React.FC = () => {
    const { cityName } = useParams<{ cityName: string }>();
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const apiKey = 'e60d0a7544c86335cfdfcd7d4ce0decd'; // Replace with your actual API key
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
                const data = response.data;
                setWeatherData({
                    city: data.name,
                    temperature: data.main.temp,
                    weather: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    pressure: data.main.pressure,
                    // Add more weather data properties as needed
                });
            } catch (error) {
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [cityName]);

    useEffect(() => {
        document.title = `Weather for ${weatherData?.city || 'City'}`;
    }, [weatherData?.city]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Weather for {weatherData?.city}</h1>
            <p>Temperature: {weatherData?.temperature}°C</p>
            <p>Weather: {weatherData?.weather}</p>
            <p>Humidity: {weatherData?.humidity}%</p>
            <p>Wind Speed: {weatherData?.windSpeed} m/s</p>
            <p>Pressure: {weatherData?.pressure} hPa</p>
            {/* Add optional features like map display and unit conversion */}
        </div>
    );
};

export default WeatherPage;
