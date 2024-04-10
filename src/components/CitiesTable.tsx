import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { fetchCities } from "../services/cityService";

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [weatherData, setWeatherData] = useState<any | null>(null); // State to hold weather data
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<string>("asc");
  const observer = useRef<any>();
  const lastCityElementRef = useCallback((node: any) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPageNumber) => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCities(page);
        setCities((prevCities) => [...prevCities, ...data]);
      } catch (error) {
        setError("Error fetching city data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const fetchWeatherData = async (cityName: string) => {
    try {
      const apiKey = "e60d0a7544c86335cfdfcd7d4ce0decd"; // Replace with your actual API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      setWeatherData(data); // Store weather data in state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSort = (columnName: string) => {
    if (sortColumn === columnName) {
      // Toggle sort direction if same column clicked again
      setSortDirection((prevDirection) =>
        prevDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // Set new sort column and default to ascending direction
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortedCities = [...cities].sort((a, b) => {
    if (sortColumn && a[sortColumn] && b[sortColumn]) {
      if (sortDirection === "asc") {
        return a[sortColumn].toString().localeCompare(b[sortColumn].toString());
      } else {
        return b[sortColumn].toString().localeCompare(a[sortColumn].toString());
      }
    }
    return 0;
  });

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Cities Table</h1>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("geoname_id")}>Geoname ID</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("name")}>City Name</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("cou_name_en")}>Country Name</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("ascii_name")}>ASCII Name</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("alternate_names")}>Alternate Names</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("population")}>Population</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("digital_elevation_model")}>
              Digital Elevation Model
            </th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("timezone")}>Timezone</th>
            <th style={{ border: "1px solid black" }} onClick={() => handleSort("country_code")}>Country Code</th>
            <th style={{ border: "1px solid black" }}>Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {sortedCities.map((city, index) => {
            if (cities.length === index + 1) {
              return (
                <tr
                  ref={lastCityElementRef}
                  key={city.geoname_id}
                  style={{ border: "1px solid black" }}
                >
                  <td style={{ border: "1px solid black" }}>
                    {city.geoname_id}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    <Link to="#" onClick={() => fetchWeatherData(city.name)}>
                      {city.name}
                    </Link>
                    <a
                      href={`/weather/${city.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      
                    </a>
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.cou_name_en}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.ascii_name}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.alternate_names
                      ? city.alternate_names.join(", ")
                      : ""}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.population}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.digital_elevation_model}
                  </td>
                  <td style={{ border: "1px solid black" }}>{city.timezone}</td>
                  <td style={{ border: "1px solid black" }}>
                    {city.country_code}
                  </td>
                  <td
                    style={{ border: "1px solid black" }}
                  >{`Longitude: ${city.coordinates.lon}, Latitude: ${city.coordinates.lat}`}</td>
                </tr>
              );
            } else {
              return (
                <tr key={city.geoname_id} style={{ border: "1px solid black" }}>
                  <td style={{ border: "1px solid black" }}>
                    {city.geoname_id}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    <Link
                      to={`/weather/${city.name}`}
                      onClick={() => fetchWeatherData(city.name)}
                    >
                      {city.name}
                    </Link>
                    <a
                      href={`/weather/${city.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      
                    </a>
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.cou_name_en}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.ascii_name}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.alternate_names
                      ? city.alternate_names.join(", ")
                      : ""}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.population}
                  </td>
                  <td style={{ border: "1px solid black" }}>
                    {city.digital_elevation_model}
                  </td>
                  <td style={{ border: "1px solid black" }}>{city.timezone}</td>
                  <td style={{ border: "1px solid black" }}>
                    {city.country_code}
                  </td>
                  <td
                    style={{ border: "1px solid black" }}
                  >{`Longitude: ${city.coordinates.lon}, Latitude: ${city.coordinates.lat}`}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      {/* Display weather data in a modal or another component */}
      {weatherData && (
        <div>
          <h2>Weather for {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          {/* Add more weather details as needed */}
        </div>
      )}
    </div>
  );
};

export default CitiesTable;
