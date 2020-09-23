const express = require('express');
const path = require('path');
const app = express();
var cors = require('cors')

app.use(cors())

app.use('/', require('./routes/index'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));