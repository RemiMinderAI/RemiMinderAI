const express = require('express');
const app = express();
const PORT = 3001; 

// This is a placeholder to show the backend is handling the route.
app.get('/register/patient', (req, res) => {
  // In a full application, you would render a registration page here.
  res.status(200).send(`
    <html>
      <head><title>Patient Registration</title></head>
      <body>
        <h1>Patient Registration Page</h1>
        <p>This page is served by the Express backend.</p>
      </body>
    </html>
  `);
});

app.get('/register/caregiver', (req, res) => {
  // In a full application, you would render a registration page here.
  res.status(200).send(`
    <html>
      <head><title>Caregiver Registration</title></head>
      <body>
        <h1>Caregiver Registration Page</h1>
        <p>This page is served by the Express backend.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});