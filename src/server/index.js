require('dotenv').config();
const path = require('path');

// Requiring LTIJS provider
const lti = require('ltijs').Provider;

// Creating a provider instance
let options = {};
if (process.env.MODE === 'production') {
  options = {
    staticPath: path.join(__dirname, '../../dist'), // Path to static files
    cookies: { secure: false },
  };
}

const approute = process.env.LTI_APPROUTE ? process.env.LTI_APPROUTE : '';
options.appRoute = approute;
options.loginRoute = `${approute}/login`;
options.keysetRoute = `${approute}/keys`;
options.invalidTokenRoute = `${approute}/invalidtoken`;
options.sessionTimeoutRoute = `${approute}/sessiontimeout`;

lti.setup(
  process.env.LTI_KEY,
  // Setting up database configurations
  {
    url: `mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`,
    connection: { user: process.env.DB_USER, pass: process.env.DB_PASS },
  },
  options
);

// When receiving successful LTI launch redirects to app.
lti.onConnect((context, req, res) => {
  if (process.env.MODE === 'production') {
    return res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
  return lti.redirect(res, `http://localhost:${process.env.CLIENTPORT}`);
});

// Routes
const apiRouter = require('./api');

// Names and Roles route.
lti.app.get(`${process.env.LTI_APPROUTE}/api/members`, (req, res) => {
  lti.NamesAndRoles.getMembers(res.locals.context)
    .then((members) => {
      console.log(members);
      res.send(members.members);
    })
    .catch((err) => res.status(400).send(err));
});

// Grades routes.
lti.app.get(`${process.env.LTI_APPROUTE}/api/grades`, (req, res) => {
  lti.Grade.result(res.locals.context)
    .then((grades) => res.status(200).send(grades))
    .catch((err) => {
      console.log(err);
      return res.status(400);
    });
});

lti.app.post(`${process.env.LTI_APPROUTE}/api/grades`, (req, res) => {
  try {
    lti.Grade.ScorePublish(res.locals.context, req.body);
    return res.status(200).send(req.body);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Routes
lti.app.use(`${process.env.LTI_APPROUTE}/api`, apiRouter);

/**
 * Sets up the LTI tool's database and starts the express server.
 * Provides additional functionality with registering the platform
 * and providing the public key to connect the LTI tool to moodle.
 */
async function setup() {
  // Deploying provider, connecting to the database and starting express server.
  const port = process.env.SERVERPORT ? process.env.SERVERPORT : 8080;
  await lti.deploy({ port });

  // Register platform, if needed.
  await lti.registerPlatform({
    url: process.env.PLATFORM_URL,
    name: 'Platform',
    clientId: process.env.PLATFORM_CLIENTID,
    authenticationEndpoint: process.env.PLATFORM_ENDPOINT,
    accesstokenEndpoint: process.env.PLATFORM_TOKEN_ENDPOINT,
    authConfig: {
      method: 'JWK_SET',
      key: process.env.PLATFORM_KEY_ENDPOINT,
    },
  });

  // Get the public key generated for that platform.
  const plat = await lti.getPlatform(
    process.env.PLATFORM_URL,
    process.env.PLATFORM_CLIENTID
  );
  console.log(await plat.platformPublicKey());
}

setup();
