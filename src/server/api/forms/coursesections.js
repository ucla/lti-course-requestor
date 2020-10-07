const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res) => {
  // Const { termCode = '20F' } = req.body.termCode;
  // const { subjectAreaCode = 'ENGCOMP' } = req.body.subjectAreaCode;
  // const { courseCatalogNumber = '0001' } = req.body.courseCatalogNumber;
  // const { classNumber = '001' } = req.body.courseNumber;
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/ClassSections/17F/ENGCOMP/0001/001/ClassSectionDetail',
      // Params: {
      //   offeredTermCode: termCode,
      //   subjectAreaCode,
      //   courseCatalogNumber,
      //   classNumber,
      // },
    });
    // Res.send(result);
    // const { classSectionIds = [] } = result.classSectionID;

    console.log(result);
  })();
});

module.exports = router;
