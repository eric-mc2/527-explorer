const express = require("express");
const axios = require("axios");
const https = require('https')
const http = require('http');
const path = require('path');
const cors = require("cors");
const fs = require('fs');

const app = express();

const PORT = 3001; // Local port for your proxy server
const API_BASE_URL = "https://projects.propublica.org/527-explorer"; // Replace with the real API base URL
const API_ROUTES = ["/orgs", "/expenditures", "/contributions", "/search", "/search_options"];

// Load the SSL certificates
const options = {
    key: fs.readFileSync(path.join(__dirname, 'private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificate.pem')),
};

// Generic proxy endpoint
const proxyCallback = async (req, res) => {
  try {
    const url = `${API_BASE_URL}${req.originalUrl}`; // Forward the original path
    const response = await axios({
      method: req.method,
      url: url,
      headers: req.headers, // Forward incoming headers (optional, modify as needed)
      data: req.body, // Forward the request body (if needed)
    });

    res.status(response.status).send(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).send(error.message || "Proxy Error");
  }
};

app.use(cors({ origin: "http://127.0.0.1:3000" }));

API_ROUTES.forEach( (x) => {
    app.use(x, proxyCallback);
});

// http.createServer(app).listen(PORT, '127.0.0.1', () => console.log(`Proxy running at http://127.0.0.1:${PORT}`));
// http.createServer(app).listen(PORT, 'localhost', () => console.log(`Proxy running at http://localhost:${PORT}`));
https.createServer(app).listen(PORT, '127.0.0.1', () => console.log(`Proxy running at https://127.0.0.1:${PORT}`));
// https.createServer(options, app).listen(PORT, 'localhost', () => console.log(`Proxy running at https://localhost:${PORT}`));

