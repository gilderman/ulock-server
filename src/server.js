const express = require('express');

const config = require('../config/config');

const routes = require('../routes/routes');
const auth_routes = require('../routes/auth_routes');

const logger = require('../middlewares/logger');
const axios_middleware = require("./middlewares/axios_middleware");

const app = express();

// Middleware
if (LOGGER === true) {
	app.use(logger);
}
app.use(axios_middleware);
app.use(express.json()); 

// routes
app.use('/', routes);
app.use('/', auth_routes);

// start the server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
