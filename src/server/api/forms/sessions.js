const express = require('express');

const router = express.Router();
const registrar = require('../../services/registrar');

router.post('/', (req, res) => {
  // Const { session } = req.body;
  (async () => {
    const result = await registrar.call({
      url: '/sis/api/v1/Dictionary/TermSessions',
      params: {
        sessionTypeName: 'Summer',
      },
    });
    res.send(result);
    console.log(result);
  })();
});

module.exports = router;
