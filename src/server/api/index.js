const express = require('express');

const router = express.Router();
const formsRoute = require('./forms');

router.use('/forms', formsRoute);

module.exports = router;
