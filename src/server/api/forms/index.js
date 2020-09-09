const express = require('express');

const router = express.Router();

const termsRoute = require('./terms');
const sessionsRoute = require('./sessions');
const subjareaRoute = require('./subjectareas');

router.use('/getTerms', termsRoute);
router.use('/getSessions', sessionsRoute);
router.use('/getSubjectareas', subjareaRoute);

module.exports = router;
