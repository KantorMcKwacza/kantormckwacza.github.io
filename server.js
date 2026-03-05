const express = require('express');
const path = require('path');

const app = express();

const PORT = 4200;

app.use(express.static(path.join(__dirname, '/')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
