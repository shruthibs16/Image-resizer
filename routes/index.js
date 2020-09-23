const express = require('express');
const router = express.Router();
const resize = require("../resize");

const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-438237.okta.com/oauth2/default', // required
  clientId:'0oa113nv8wmocewau4x7',
  assertClaims: {
    aud: 'api://default'
  }
});

function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err.message);
    });
}

router.get('/authorize', authenticationRequired,  (req, res) => {
    const widthString = req.query.width
    const heightString = req.query.height
    const format = req.query.format
  
    // Parse to integer if possible
    let width, height
    if (widthString) {
      width = parseInt(widthString);
    }
    if (heightString) {
      height = parseInt(heightString)
    }
    // Set the content-type of the response
    res.type(`image/${format || 'png'}`)
  
    // Get the resized image
    resize('nodejs.png', format, width, height).pipe(res)
})

router.get('/',  (req, res) => {
  const widthString = req.query.width
  const heightString = req.query.height
  const format = req.query.format

  // Parse to integer if possible
  let width, height
  if (widthString) {
    width = parseInt(widthString);
  }
  if (heightString) {
    height = parseInt(heightString)
  }
  // Set the content-type of the response
  res.type(`image/${format || 'png'}`)

  // Get the resized image
  resize('nodejs.png', format, width, height).pipe(res)
})

module.exports = router;





