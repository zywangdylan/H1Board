import React from "react";
import { useEffect, useState } from "react";
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
import { DataGrid } from "@mui/x-data-grid";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

// import { Bar } from 'react-chartjs-2';
// import { Typography } from '@material-ui/core';

const config = require("../config.json");

export default function CompanySummary(props) {
  const company_id = props.companyInfo.companyId;
  console.log("company id in this page is ", props.companyInfo.companyId);

  const [pageSize, setPageSize] = useState(10);
  const [companySummary, setCompanySummary] = useState([]);

  const [companySearch, setCompanySearch] = useState("");

  // overall stats
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [numReviews, setNumReviews] = useState("");
  const [description, setDescription] = useState("");
  const [numLocations, setNumLocations] = useState("");
  const [numJobs, setNumJobs] = useState("");

  // ratings
  const [avgRating, setAvgRating] = useState("");
  const [workLifeBalance, setWorkLifeBalance] = useState("");
  const [compensationOrBenefits, setCompensationOrBenefits] = useState("");
  const [jobSecurityOrAdvance, setJobSecurityOrAdvance] = useState("");
  const [management, setManagement] = useState("");
  const [culture, setCulture] = useState("");

  const [ratingData, setRatingData] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/companySummary/${company_id}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const companySummaryWithId = resJson.map((summary) => ({
          id: summary.companyId,
          ...summary,
        }));
        setCompanySummary(companySummaryWithId);
        if (companySummaryWithId != null) {
          setCompanyName(companySummaryWithId[0].company_name);
          setIndustry(companySummaryWithId[0].industry);
          setDescription(companySummaryWithId[0].textReview);
          setNumReviews(companySummaryWithId[0].num_reviews);
          setNumLocations(companySummaryWithId[0].num_locations);
          setNumJobs(companySummaryWithId[0].num_jobs);

          setAvgRating(companySummaryWithId[0].avg_rating);
          setWorkLifeBalance(companySummaryWithId[0].workLifeBalance);
          setCompensationOrBenefits(
            companySummaryWithId[0].jobSecurityOrAdvance
          );
          setJobSecurityOrAdvance(
            companySummaryWithId[0].compensationOrBenefits
          );
          setManagement(companySummaryWithId[0].management);
          setCulture(companySummaryWithId[0].culture);
        }
      });
  }, []);

  const initialDataRatings = [
    {
      name: companyName + " ratings",
      average_rating: avgRating,
      work_life_balance: workLifeBalance,
      job_security_and_advancement: jobSecurityOrAdvance,
      management_score: management,
      culture_score: culture,
    },
  ];

  const initialDataStats = [
    {
      name: companyName + " overall stats",
      num_reviews: numReviews,
      num_locations: numLocations,
      num_jobs: numJobs,
    },
  ];

  const handleButtonClick = () => {
    fetch(
      `http://${config.server_host}:${
        config.server_port
      }/companySummary/${0}?companyName=${companySearch.toLowerCase()}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        const companySummaryWithId = resJson.map((summary) => ({
          id: summary.companyId,
          ...summary,
        }));
        if (companySummaryWithId != null) {
          const searchDataRatings = [
            {
              name: companySummaryWithId[0].company_name + " ratings",
              average_rating: companySummaryWithId[0].avg_rating,
              work_life_balance: companySummaryWithId[0].workLifeBalance,
              job_security_and_advancement:
                companySummaryWithId[0].jobSecurityOrAdvance,
              management_score: companySummaryWithId[0].management,
              culture_score: companySummaryWithId[0].culture,
            },
          ];

          const searchlDataStats = [
            {
              name: companySummaryWithId[0].company_name + " overall stats",
              num_reviews: companySummaryWithId[0].num_reviews,
              num_locations: companySummaryWithId[0].num_locations,
              num_jobs: companySummaryWithId[0].num_jobs,
            },
          ];

          setRatingData([initialDataRatings[0], searchDataRatings[0]]);
          setStatsData([initialDataStats[0], searchlDataStats[0]]);
        }
      });
    setButtonClicked(true);
  };

  const labelFormatter = (value, entry) => {
    return `${entry}: ${value}`;
  };

  return (
    <div>
      <div style={{ margin: "2rem 0" }}>
        <h3>Company Description: {description}</h3>
        {buttonClicked ? (
          <div>
            <BarChart
              width={1200}
              height={300}
              data={ratingData}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="average_rating" fill="#82ca9d">
                <LabelList dataKey="average_rating" position="right" />
              </Bar>
              <Bar dataKey="work_life_balance" fill="#DFFF00">
                <LabelList dataKey="work_life_balance" position="right" />
              </Bar>
              <Bar dataKey="job_security_and_advancement" fill="#FFBF00">
                <LabelList
                  dataKey="job_security_and_advancement"
                  position="right"
                />
              </Bar>
              <Bar dataKey="management_score" fill="#FF7F50">
                <LabelList dataKey="management_score" position="right" />
              </Bar>
              <Bar dataKey="culture_score" fill="#DE3163">
                <LabelList dataKey="culture_score" position="right" />
              </Bar>
            </BarChart>
            <BarChart
              width={1200}
              height={300}
              data={statsData}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="num_reviews" fill="#8884d8">
                <LabelList dataKey="num_reviews" position="right" />
              </Bar>
              <Bar dataKey="num_locations" fill="#3f51b5">
                <LabelList dataKey="num_locations" position="right" />
              </Bar>
              <Bar dataKey="num_jobs" fill="#283593">
                <LabelList dataKey="num_jobs" position="right" />
              </Bar>
            </BarChart>
          </div>
        ) : (
          <div>
            <BarChart
              width={1200}
              height={300}
              data={initialDataRatings}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="average_rating" fill="#82ca9d">
                <LabelList dataKey="average_rating" position="right" />
              </Bar>
              <Bar dataKey="work_life_balance" fill="#DFFF00">
                <LabelList dataKey="work_life_balance" position="right" />
              </Bar>
              <Bar dataKey="job_security_and_advancement" fill="#FFBF00">
                <LabelList
                  dataKey="job_security_and_advancement"
                  position="right"
                />
              </Bar>
              <Bar dataKey="management_score" fill="#FF7F50">
                <LabelList dataKey="management_score" position="right" />
              </Bar>
              <Bar dataKey="culture_score" fill="#DE3163">
                <LabelList dataKey="culture_score" position="right" />
              </Bar>
            </BarChart>
            <BarChart
              width={1200}
              height={300}
              data={initialDataStats}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="num_reviews" fill="#8884d8">
                <LabelList dataKey="num_reviews" position="right" />
              </Bar>
              <Bar dataKey="num_locations" fill="#3f51b5">
                <LabelList dataKey="num_locations" position="right" />
              </Bar>
              <Bar dataKey="num_jobs" fill="#283593">
                <LabelList dataKey="num_jobs" position="right" />
              </Bar>
            </BarChart>
          </div>
        )}
        <div>
          <TextField
            label="Company Name"
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            style={{ width: "100%", margin: "1rem 0" }}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Compare with Another Company
        </Button>
      </div>
    </div>
  );
}
