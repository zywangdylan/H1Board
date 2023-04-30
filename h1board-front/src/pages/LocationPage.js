import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const config = require("../config.json");
const locationsFile = require("../locations.json");

const MapContainer = (props) => {
  const [caseStatus, setCaseStatus] = useState(true);
  const [empSize, setEmpSize] = useState("10,000+");
  const [searchResults, setSearchResults] = useState([]);
  const [state, setState] = useState({
    activeMarker: null,
    selectedPlace: {},
    showingInfoWindow: false,
  });

  const onMarkerClick = (props, marker) => {
    setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true,
    });
  };

  const onInfoWindowClose = () => {
    setState({
      activeMarker: null,
      selectedPlace: {},
      showingInfoWindow: false,
    });
  };

  const mapStyles = {
    width: "100%",
    height: "100%",
    margin: "5px 0",
  };

  const search = () => {
    const key = caseStatus + '_' + empSize;
    const locationsData = locationsFile.find(obj => obj.key === key);
    setSearchResults(locationsData.value);
  };

  // fetch google map api
  const storedData = [];
  const search_unused = () => {
    let locationsDataArray = JSON.parse(localStorage.getItem("locationsData")) || [];
    fetch(
      `http://${config.server_host}:${config.server_port}/locations?caseStatus=${caseStatus}&empSize=${empSize}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const fetchPromises = resJson.map(async (item) => {
          const locationName = item.location;
          return fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              locationName
            )}&key=${config.API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              const location = data.results[0].geometry.location;
              return {
                name: locationName,
                num_companies: item.num_companies,
                lat: location.lat,
                lng: location.lng,
              };
            })
            .catch((error) => {
              console.error("Error:", error);
              return null;
            });
        });

        Promise.all(fetchPromises)
          .then((locationsData) => {
            console.log(locationsData);
            const key = caseStatus + '_' + empSize;
            storedData.push({key: key, value: locationsData});

            locationsDataArray = [...locationsDataArray, ...storedData];
            localStorage.setItem("locationsData", JSON.stringify(locationsDataArray));

            setSearchResults(locationsData);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

  };

  // download localstorage into local file in json format
  const download = () => {
    let locationsDataArray = JSON.parse(localStorage.getItem("locationsData")) || [];
    const dataString = JSON.stringify(locationsDataArray);
    const blob = new Blob([dataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "locations.json";
    // Append the link to the document and click it
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <Grid container spacing={3} style={{ margin: "2rem 0", marginLeft: 500 }}>
        <Grid item xs={6}>
          <FormControlLabel
            label="Case Approved"
            control={
              <Checkbox
                checked={caseStatus}
                onChange={(e) => setCaseStatus(e.target.checked)}
              />
            }
          />
        </Grid>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-standard-label">
            empSize
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={empSize}
            onChange={(e) => setEmpSize(e.target.value)}
            label="Employement Size"
          >
            <MenuItem value={"1"}>1</MenuItem>
            <MenuItem value={"2 to 10"}>2 to 10</MenuItem>
            <MenuItem value={"11 to 50"}>11 to 50</MenuItem>
            <MenuItem value={"51 to 200"}>51 to 200</MenuItem>
            <MenuItem value={"201 to 500"}>201 to 500</MenuItem>
            <MenuItem value={"501 to 1,000"}>501 to 1,000</MenuItem>
            <MenuItem value={"1,001 to 5,000"}>1,001 to 5,000</MenuItem>
            <MenuItem value={"5,001 to 10,000"}>5,001 to 10,000</MenuItem>
            <MenuItem value={"10,000+"}>10,000+</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Button
        variant="contained"
        onClick={() => search()}
        style={{ padding: "10px 20px",left: "50%", transform: "translateX(-50%)", textAlign: "left" }}
      >
        Search
      </Button>

      {/* <Button
        variant="contained"
        onClick={() => download()}
        style={{ padding: "10px 20px",left: "50%", transform: "translateX(-50%)", textAlign: "left" }}
      >
        download
      </Button> */}

      <div>
      <h1 style={{ textAlign: 'center' }}>Location and Company Size Map</h1>
      {searchResults.length > 0 ? (
        <Map
          google={props.google}
          zoom={4}
          style={mapStyles}
          initialCenter={{ lat: 37.7749, lng: -122.4194 }}
        >
          {searchResults.map((result, index) => (
            <Marker
              key={index}
              name={result.name}
              title={`${result.num_companies} companies`}
              onClick={onMarkerClick}
              position={{ lat: result.lat, lng: result.lng }}
            />
          ))}

          <InfoWindow
            marker={state.activeMarker}
            visible={state.showingInfoWindow}
            onClose={onInfoWindowClose}
          >
            <div>
              <h3>{state.selectedPlace.name}</h3>
              <p>{state.selectedPlace.title}</p>
            </div>
          </InfoWindow>
        </Map>
      ) : (
        <Map
          google={props.google}
          zoom={4}
          style={mapStyles}
          initialCenter={{ lat: 37.7749, lng: -122.4194 }}
        ></Map>
      )}
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: config.API_KEY,
})(MapContainer);
