// src/components/CitiesTable.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchCities } from "../services/cityService";

const CitiesTable: React.FC = () => {
    const [cities, setCities] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const observer = useRef<any>();
    const lastCityElementRef = useCallback((node: any) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPageNumber => prevPageNumber + 1);
        }
      })
      if (node) observer.current.observe(node);
    }, [])
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchCities(page);
          setCities(prevCities => [...prevCities, ...data]);
        } catch (error) {
          console.log("Error fetching city data:", error);
        }
      };
  
      fetchData();
    }, [page]);

  return (
    <div>
      <h1 style={{textAlign:"center"}}>Cities Table</h1>
      <table style={{borderCollapse: 'collapse'}}>
      <thead>
    <tr>
        <th style={{border: '1px solid black'}}>Geoname ID</th>
        <th style={{border: '1px solid black'}}>City Name</th>
        <th style={{border: '1px solid black'}}>Country Name</th>
        <th style={{border: '1px solid black'}}>ASCII Name</th>
        <th style={{border: '1px solid black'}}>Alternate Names</th>
        <th style={{border: '1px solid black'}}>Population</th>
        <th style={{border: '1px solid black'}}>Digital Elevation Model</th>
        <th style={{border: '1px solid black'}}>Timezone</th>
        <th style={{border: '1px solid black'}}>Country Code</th>
        <th style={{border: '1px solid black'}}>Coordinates</th>
    </tr>
</thead>
<tbody>
  {cities.map((city, index) => {
    if (cities.length === index + 1) {
      return (
        <tr ref={lastCityElementRef} key={city.geoname_id} style={{border: '1px solid black'}}>
          <td style={{border: '1px solid black'}}>{city.geoname_id}</td>
          <td style={{border: '1px solid black'}}>{city.name}</td>
          <td style={{border: '1px solid black'}}>{city.cou_name_en}</td>
          <td style={{border: '1px solid black'}}>{city.ascii_name}</td>
          <td style={{border: '1px solid black'}}>{city.alternate_names ? city.alternate_names.join(", ") : ''}</td>
          <td style={{border: '1px solid black'}}>{city.population}</td>
          <td style={{border: '1px solid black'}}>{city.digital_elevation_model}</td>
          <td style={{border: '1px solid black'}}>{city.timezone}</td>
          <td style={{border: '1px solid black'}}>{city.country_code}</td>
          <td style={{border: '1px solid black'}}>{`Longitude: ${city.coordinates.lon}, Latitude: ${city.coordinates.lat}`}</td>
        </tr>
      );
    } else {
      return (
        <tr key={city.geoname_id} style={{border: '1px solid black'}}>
          <td style={{border: '1px solid black'}}>{city.geoname_id}</td>
          <td style={{border: '1px solid black'}}>{city.name}</td>
          <td style={{border: '1px solid black'}}>{city.cou_name_en}</td>
          <td style={{border: '1px solid black'}}>{city.ascii_name}</td>
          <td style={{border: '1px solid black'}}>{city.alternate_names ? city.alternate_names.join(", ") : ''}</td>
          <td style={{border: '1px solid black'}}>{city.population}</td>
          <td style={{border: '1px solid black'}}>{city.digital_elevation_model}</td>
          <td style={{border: '1px solid black'}}>{city.timezone}</td>
          <td style={{border: '1px solid black'}}>{city.country_code}</td>
          <td style={{border: '1px solid black'}}>{`Longitude: ${city.coordinates.lon}, Latitude: ${city.coordinates.lat}`}</td>
        </tr>
      );
    }
  })}
</tbody>
      </table>
    </div>
  );
};

export default CitiesTable;
