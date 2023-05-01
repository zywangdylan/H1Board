import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, Link } from "google-maps-react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

import "./Location.css"
const config = require("../config.json");
const locationsFile = require("../locations.json");

const MapContainer = (props) => {
  const pageHeight = document.documentElement.scrollHeight;
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
    width: '100%',
    height: '90%',
    top: '60%',
    left: '50%',
    bottom: '0',
    transform: 'translate(-50%, -50%)',
    margin: "5px 0",
  };

  const search = () => {
    const key = caseStatus + '_' + empSize;
    const locationsData = locationsFile.find(obj => obj.key === key);
    setSearchResults(locationsData.value);
    window.scrollTo({
      top: pageHeight + 120,
      behavior: "smooth"
    });
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
    <div style={{ height: '100vh' }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center" }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", flexDirection: "column", marginRight: "5rem" }}>
            <Typography style={{ textAlign: 'left', fontFamily: "'Bruno Ace SC', cursive", fontWeight: "bold" }} variant="h4">Location and Company Size Map</Typography>
            <div style={{ margin: "2rem 0", display: 'flex', justifyContent: 'start', gap: '5rem' }}>
              <FormControlLabel
                label="Case Approved"
                control={
                  <Checkbox
                    checked={caseStatus}
                    onChange={(e) => setCaseStatus(e.target.checked)}
                  />
                }
              />
              <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }} xs={3}>
                <InputLabel id="demo-simple-select-standard-label">
                  Employee Size
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
            </div>
          </div>

          <Button
            variant="contained"
            onClick={() => search()}
            style={{ display: "flex", flexDirection: "column", padding: "0 2rem", textAlign: "left", backgroundColor: "#212121" }}
            className="mouse_scroll"
          >
            Search
            <div style={{ marginTop: "1.5rem"}}>
              <span className="m_scroll_arrows unu"></span>
              <span className="m_scroll_arrows doi"></span>
              <span className="m_scroll_arrows trei"></span>
            </div>
          </Button>
        </div>

        {/* <Button
          variant="contained"
          onClick={() => download()}
          style={{ padding: "10px 20px",left: "50%", transform: "translateX(-50%)", textAlign: "left" }}
        >
          download
        </Button> */}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Button
          style={{ marginTop: "5.2rem", zIndex: "10", gap: "2rem" }}
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <KeyboardDoubleArrowUpIcon />
          BACK TO SEARCH
        </Button>
        {
          searchResults.length > 0 ? (
            <Map
              google={props.google}
              zoom={4}
              style={mapStyles}
              initialCenter={{ lat: 37.0902, lng: -95.7129 }}
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
              initialCenter={{ lat: 37.0902, lng: -95.7129 }}
            ></Map>
          )
        }
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: config.API_KEY,
})(MapContainer);
