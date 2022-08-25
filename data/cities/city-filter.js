/* eslint-disable max-len */
import fs from 'fs';
import cities from './world-cities.json' assert {type: 'json'};

// filter cities with more than 100k people
function filterCities(citiesToFilter) {
  const filteredCities = citiesToFilter.filter((city) => city.population > 20000 && city.population < 60000);
  const jsonFiltered = JSON.stringify(filteredCities);
  console.log(filteredCities);
  // create a local file and save the filtered cities to it
  fs.writeFile('./world-cities-filtered.json', jsonFiltered, 'utf-8', (err) => {
    console.error(err);
  });
  // return filteredCities;
}

filterCities(cities);
