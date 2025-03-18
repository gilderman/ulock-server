const uhome_api = require('../helpers/uhome_helpers');

exports.queryDeviceStatus = async (req, res) => {
	uhome_api.sendPostRequest(req, res, 'Query');
}

exports.discovery = async (req, res) => {
	uhome_api.sendPostRequest(req, res, 'Discovery');
}

exports.lock = async (req, res) => {
	uhome_api.lockCommand(req, res, "lock");
}

exports.unlock = async (req, res) => {
	uhome_api.lockCommand(req, res, "unlock");
}
