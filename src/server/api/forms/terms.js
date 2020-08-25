const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

console.log('get terms route');
router.get('/', (req, res) => {
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/Dictionary/Terms',
      params: {
        AcademicYear: '2019-2020',
      },
    });
    // Res.send(result);
    const { terms = [] } = result;
    const termsData = {};
    terms.forEach(term => {
      const { termCode: id, termName } = term;
      const seasons = termName.split(' ');
      const year = seasons.pop();
      const label = seasons.join(' ');
      if (!termsData[year]) termsData[year] = [];
      termsData[year].push({ id, label });
    });
    console.log(termsData);
    res.send(termsData);
  })();
});

module.exports = router;
