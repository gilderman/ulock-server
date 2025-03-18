const config = require('../config/config');
const axios = require('axios');
const qs = require('querystring');

const tokenManager = require('../helpers/token_manager');

exports.login = (req, res) => {
	const REDIRECT_URI = `http://localhost:${config.PORT}/callback`;
	const AUTHORIZATION_URL = 'https://oauth.u-tec.com/authorize';

    const authUrl = `${AUTHORIZATION_URL}?client_id=${config.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openapi`;
    res.redirect(authUrl);
});

exports.callback = async (req, res) => {
    const { code } = req.query;
    try {
        const tokenResponse = await axios.post(TOKEN_URL, 
		  qs.stringify({
            client_id: config.CLIENT_ID,
            code: code,
            grant_type: 'authorization_code'
		  }) 
		);

		tokenManager.saveTokens(tokenResponse);
		
		res.status(200).send('Ok');
    } catch (error) {
        res.status(500).send('Authentication failed');
    }
});

exports.refreshAccessToken() {
   const refreshToken = tokenManager.readTokenFromFile(TokenManager.REFRESH_TOKEN_FILE);	
   console.log(`Read refresh token ${refreshToken}`);
   
   try {
     const response = await axios.post(TOKEN_URL, new URLSearchParams({
       grant_type: 'refresh_token',  
       client_id: CLIENT_ID,          
       client_secret: CLIENT_SECRET,  
       refresh_token: refreshToken 
    }));

	tokenManager.saveTokens(response);
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
  }
}






