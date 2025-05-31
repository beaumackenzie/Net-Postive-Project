

fetch('http://localhost:3000/nyc_table1')
  .then(response => response.json())
  .then(features => {
    console.log("Fetched features:", features)});