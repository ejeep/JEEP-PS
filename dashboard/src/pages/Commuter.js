import React, { useState } from "react";
import { Box, Typography, List, ListItem, Drawer, IconButton, Divider } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from "@mui/system";
import About from './About'; // Importing About component
import Account from './Account'; // Importing Account component
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation

// Mock data for routes
const mockRoutes = [
  { name: "Jeep #1", status: "North Bound" },
  { name: "Jeep #2", status: "South Bound" }
];

// Sidebar styling
const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: theme.spacing(2),
  height: "100vh",
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 250,
  padding: theme.spacing(2),
}));

// Main panel styling
const PanelContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#f8f9fa",
  overflowY: "auto",
}));

// Responsive Layout
const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' }, // Stacks on mobile, side-by-side on desktop
  height: '100vh',
}));

const MapContainer = styled(Box)({
  width: '100%',
  flexGrow: 1,
  height: { xs: '400px', md: '100%' }, // 100% height on desktop
  position: 'relative',
});

function Commuter() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'about', or 'account'
  const navigate = useNavigate(); // Using useNavigate for routing

  // Handlers to switch between views
  const showHome = () => setCurrentView('home');
  const showAbout = () => setCurrentView('about');
  const showAccount = () => setCurrentView('account');

  // Logout handler
  const handleLogout = () => {
    // Add logout logic here, such as clearing user session or authentication tokens
    navigate('/'); // Redirect to Main.js or the home page after logout
  };

  return (
    <AppContainer>
      {/* Sidebar */}
      <SidebarContainer sx={{ display: { xs: 'none', md: 'block' }, width: '250px' }}>
        <Typography
          variant="h5"
          component="div"
          onClick={showHome}  // Clicking JEEP-PS logo shows home (map and routes)
          sx={{
            fontWeight: 'bold',
            padding: '20px',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            cursor: 'pointer',  // Makes it look clickable
          }}
        >
          JEEP-PS
        </Typography>

        <Box>
          <List>
            <ListItem button onClick={showAbout}>About</ListItem>
            <ListItem button onClick={showAccount}>Account</ListItem>
            <ListItem button onClick={handleLogout}>Logout</ListItem> {/* Logout button triggers handleLogout */}
          </List>
        </Box>
      </SidebarContainer>

      {/* Drawer for Mobile */}
      {!isDrawerOpen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setIsDrawerOpen(true)}
          sx={{
            display: { md: 'none' },
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <DrawerContent>
          <Typography
            variant="h5"
            component="div"
            onClick={showHome}  // Clicking JEEP-PS logo in drawer shows home
            sx={{
              fontWeight: 'bold',
              padding: '20px',
              backgroundColor: '#4caf50',
              color: '#ffffff',
            }}
          >
            JEEP-PS
          </Typography>
          <List>
            <ListItem button onClick={showAbout}>About</ListItem>
            <ListItem button onClick={showAccount}>Account</ListItem>
            <ListItem button onClick={handleLogout}>Logout</ListItem> {/* Logout button in Drawer */}
          </List>
        </DrawerContent>
      </Drawer>

      {/* Conditional Rendering based on currentView */}
      {currentView === 'home' && (
        <>
          {/* Routes and Vehicles Panel */}
          <PanelContainer sx={{ width: { xs: '100%', md: '30%' }, mt: { xs: 6, md: 0 } }}>
            <Typography variant="h6" gutterBottom>Routes ({mockRoutes.length})</Typography>
            <Divider />
            <List>
              {mockRoutes.map((route, index) => (
                <ListItem
                  key={index}
                  button
                  sx={{
                    padding: '15px',
                    borderBottom: '1px solid #ddd',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                >
                  <Typography variant="body1">{route.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'gray', ml: 'auto' }}>{route.status}</Typography>
                </ListItem>
              ))}
            </List>
          </PanelContainer>

          {/* Map Panel */}
          <MapContainer sx={{ width: { xs: '100%', md: '70%' }, mt: { xs: 3, md: 0 } }}>
            <iframe
              title="Jeep Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d72791.59467740786!2d121.11279533982378!3d16.493911448929403!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x339044168316ed47%3A0x6984d3194e8cb833!2sBayombong%2C%20Nueva%20Vizcaya!5e0!3m2!1sen!2sph!4v1726255317782!5m2!1sen!2sph"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </MapContainer>
        </>
      )}

      {currentView === 'about' && <About />}
      {currentView === 'account' && <Account />}
    </AppContainer>
  );
}

export default Commuter;
