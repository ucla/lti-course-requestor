const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res) => {
  const { subjarea = '19F' } = req.body;
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/Dictionary/SubjectAreas',
      params: {
        SubjectAreaActiveTermCode: subjarea,
      },
    });
    // Res.send(result);
    console.log(result);
    const { subjectAreas = [] } = result;
    const filteredSubjAreas = subjectAreas.map(
      ({ subjectAreaCode: id, subjectAreaName }) => ({
        id,
        value: id,
        label: `${id} - ${subjectAreaName}`,
      })
    );
    console.log(filteredSubjAreas);
    res.send(filteredSubjAreas);
  })();
});

module.exports = router;
