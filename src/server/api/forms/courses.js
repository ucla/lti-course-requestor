const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res) => {
  const { termCode = '20F' } = req.body;
  const { subjectAreaCode = 'ENGCOMP' } = req.body;
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/Classes/Classes_GetClasses',
      params: {
        offeredTermCode: termCode,
        subjectAreaCode,
        PageSize: 0,
      },
    });
    console.log(result);
    const classSectionObj = {};

    result.classes.forEach((resObj) => {
      const { courseCatalogNumber, termSessionGroupCollection } = resObj;
      classSectionObj[courseCatalogNumber] = [];
      termSessionGroupCollection.forEach((term) =>
        term.classCollection.forEach((classObj) =>
          classSectionObj[courseCatalogNumber].push(classObj.classNumber)
        )
      );
    });

    console.log(classSectionObj);
    res.send(result);
  })();
});

module.exports = router;
