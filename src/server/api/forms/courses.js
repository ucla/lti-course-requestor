const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res, err) => {
  (async () => {
    const { termCode, subjectAreaCode: department } = req.body;

    const url = `/sis/api/v1/Classes/${termCode}`;
    try {
      const result = await registrar.call({
        url,
        params: {
          offeredTermCode: termCode,
          subjectAreaCode: department,
          PageSize: 0,
        },
      });
      // Console.log(result);
      if (!result) {
        throw new Error('No results');
      }
      const newResult = [];
      result.classes.forEach((resObj) => {
        const courseList = [];
        const {
          offeredTermCode,
          courseCatalogNumber,
          courseCatalogNumberDisplay,
          termSessionGroupCollection,
          subjectAreaCode,
        } = resObj;

        termSessionGroupCollection.forEach((term) =>
          term.classCollection.forEach((classObj) => {
            courseList.push(
              `${courseCatalogNumberDisplay}-${parseInt(classObj.classNumber)}`
            );
          })
        );
        newResult.push({
          offeredTermCode,
          subjectAreaCode,
          courseList,
          courseCatalogNumber,
        });
      });

      res.send(newResult);
    } catch (errorMsg) {
      err(errorMsg);
    }
  })();
});
module.exports = router;
