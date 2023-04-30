import React, { useState } from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const config = require("../config.json");

const MapContainer = (props) => {
  const [caseStatus, setCaseStatus] = useState(true);
  const [empSize, setEmpSize] = useState("");
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

  const locations = [
    {
      name: "Mountain View, CA",
      companies: 4553,
      lat: 37.386051,
      lng: -122.083855,
    },
    {
      name: "Cupertino, CA",
      companies: 2367,
      lat: 37.322998,
      lng: -122.032182,
    },
    { name: "Nashville, TN", companies: 2046, lat: 36.162664, lng: -86.781602 },
    { name: "Chicago, IL", companies: 1643, lat: 41.878113, lng: -87.629799 },
    { name: "San Jose, CA", companies: 1229, lat: 37.338208, lng: -121.886329 },
    { name: "Palo Alto, CA", companies: 938, lat: 37.441883, lng: -122.143019 },
    { name: "Houston, TX", companies: 865, lat: 29.760427, lng: -95.369803 },
    { name: "New York, NY", companies: 757, lat: 40.712776, lng: -74.005974 },
    { name: "Milwaukee, WI", companies: 756, lat: 43.038902, lng: -87.906471 },
    {
      name: "Minneapolis, MN",
      companies: 712,
      lat: 44.977753,
      lng: -93.265011,
    },
  ];

  const search = () => {
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
            )}&key=AIzaSyAv6mJfuCjDGrFhvanRT51FKyw6AbJ2Nec`
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
  apiKey: "AIzaSyAv6mJfuCjDGrFhvanRT51FKyw6AbJ2Nec",
})(MapContainer);
