require('dotenv').config();
const express = require('express');
const querystring = require('querystring')
const app = express();
const port = 8888;
const axios = require('axios')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    const scope = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
    ].join(' ');

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      state: state,
      scope: scope,
    }));
})

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
  
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
    .then(response => {
        if (response.status === 200) {
    
          const { access_token, refresh_token, expires_in } = response.data;
    
          //redirect to React app + pass along tokens in query params
          res.redirect('http://localhost:3000/?' + 
            querystring.stringify({
                access_token,
                refresh_token,
                expires_in
              })
          );
    
        } else {
            res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
        }
      })
      .catch(error => {
        res.send(error);
      });
  });

  app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query;

    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    })
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send(error);
      });
  })

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});