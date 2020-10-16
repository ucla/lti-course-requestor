const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res) => {
  const { termCode = '19F' } = req.body;
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/Dictionary/SubjectAreas',
      params: {
        SubjectAreaActiveTermCode: termCode,
        PageSize: 0,
      },
    });
    // Res.send(result);
    // console.log(result);
    const { subjectAreas = [] } = result;
    const filteredSubjAreas = subjectAreas.map(
      ({ subjectAreaCode: id, subjectAreaName }) => ({
        id,
        value: id,
        label: `${id} - ${subjectAreaName}`,
      })
    );
    // Console.log(filteredSubjAreas);
    res.send(filteredSubjAreas);
  })();
});

module.exports = router;
