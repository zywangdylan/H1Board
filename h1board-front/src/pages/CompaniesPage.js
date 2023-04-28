import { useEffect, useState } from 'react';
import { Box, Container, List, ListItemButton, ListItemIcon, ListItemText, Typography, Pagination } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import { NavLink, useNavigate } from 'react-router-dom';

const config = require('../config.json');

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // TODO: HandleListItemClick function will redict user to the specific company information page
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    navigate(`/company/${index}`);
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/companies?pageNum=${page}&pageSize=${pageSize}`)
      .then(res => res.json())
      .then(resJson => setCompanies(resJson));
  }, [page]);

  const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

  return (
    <Container style={flexFormat}>
      <Box sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper', marginTop: '2rem'}}>
        {/* Show the list of company and trigger handleListItemClick function when user click on one of the company */}
        {/* Pagination when listing companies */}
        {companies.map((company) =>
          <List component="nav" aria-label="main mailbox folders">
              <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, `${company.companyId}`)}
                sx={{ width: '100%', borderRadius: 1, boxShadow: 3, mb: 1 }}
              >
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={ company.name } secondary={ company.industry } />
                <Typography edge="end" variant="body1" color="text.secondary">{ company.employeeSize } { company.employeeSize ? 'Employees' : '' }</Typography>
              </ListItemButton>
          </List>
        )}
        <div style={{display: "flex", justifyContent:"end"}}>
          <Pagination count={10} page={page} onChange={handlePageChange} style={{margin: "2rem 0"}}/>
        </div>
      </Box>
    </Container>
  );
}
