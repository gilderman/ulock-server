const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const tokenManager = require('../helpers/token_manager');

function getUHomeHeader(name) {
    return {
      "header": { 
		"namespace": "Uhome.Device",
        "name": name,
        "messageId": uuidv4(),
        "payloadVersion": "1"
      }
   }
}

function getUHomePayload(param) {
	const payload = {
	  "devices": [
	    {
	      "id": DEVICE_ID,
	    }
	  ]
	} 
	
	payload.devices[0] = {
      ...payload.devices[0],  
      ...param            
    };

	return payload;
}

function createPostPayload(payloadName, param) {
	return {
	  ...getUHomeHeader(payloadName),
	  "payload": payloadName != 'Discovery' ? getUHomePayload(param) : {}
    }
}

exports.sendPostRequest = async (req, res, name, param = null) => {
	
	try { 
		apiResponse = await axios.post(API_URL, createPostPayload(name, param));

		payload = apiResponse.data;
		
		function hasError(payload) {
		  return payload && payload.error && payload.error.code && payload.error.message;
		}

		uHomePayload = payload.payload;
		if (hasError(uHomePayload)) {
		  console.log('Error detected:', uHomePayload);
      
		  if (uHomePayload.error.code === 'INVALID_TOKEN') {
			refreshAccessToken();
			
			apiResponse = await axios.post(API_URL,
			  createPostPayload(name, param),
		      getOAuthHeader());
			payload = apiResponse.data;
		  }
		} 
		
		res.json(payload);
    } catch (error) {
		console.log(error);
		console.log(error.status);
    }
}

exports.lockCommand = async (req, res, command) => {
	sendPostRequest(req, res, 'Command', 
		{ "command": {
            "capability": "st.lock",
            "name": command
          }
		});
}
