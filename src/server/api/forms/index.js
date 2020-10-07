const express = require('express');

const router = express.Router();

const termsRoute = require('./terms');
const sessionsRoute = require('./sessions');
const subjareaRoute = require('./subjectareas');
const courseRoute = require('./courses');
const courseSectionsRoute = require('./courseSections');

router.use('/getTerms', termsRoute);
router.use('/getSessions', sessionsRoute);
router.use('/getSubjectareas', subjareaRoute);
router.use('/getCourses', courseRoute);
router.use('/getCourseSections', courseSectionsRoute);

module.exports = router;
