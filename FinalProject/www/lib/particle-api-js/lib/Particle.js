'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentBinaryParser = require('./superagent-binary-parser');

var _superagentBinaryParser2 = _interopRequireDefault(_superagentBinaryParser);

var _Defaults = require('./Defaults');

var _Defaults2 = _interopRequireDefault(_Defaults);

var _EventStream = require('./EventStream');

var _EventStream2 = _interopRequireDefault(_EventStream);

var _Agent = require('./Agent');

var _Agent2 = _interopRequireDefault(_Agent);

var _Client = require('./Client');

var _Client2 = _interopRequireDefault(_Client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Particle Cloud API wrapper.
 *
 * See <https://docs.particle.io/reference/javascript/> for examples
 * of using the `Particle` class.
 *
 * Most Particle methods take a single unnamed argument object documented as
 * `$0` with key/value pairs for each option.
 */
var Particle = function () {
	/**
  * Contructor for the Cloud API wrapper.
  *
  * Create a new Particle object and call methods below on it.
  *
  * @param  {Object} options Options to be used for all requests (see [Defaults](../src/Defaults.js))
  */
	function Particle() {
		var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		(0, _classCallCheck3.default)(this, Particle);

		(0, _assign2.default)(this, _Defaults2.default, options);
		this.agent = new _Agent2.default(this.baseUrl);
	}

	/**
  * Login to Particle Cloud using an existing Particle acccount.
  * @param  {String} $0.username      Username for the Particle account
  * @param  {String} $0.password      Password for the Particle account
  * @param  {Number} $0.tokenDuration How long the access token should last in seconds
  * @return {Promise}
  */


	(0, _createClass3.default)(Particle, [{
		key: 'login',
		value: function login(_ref) {
			var username = _ref.username;
			var password = _ref.password;
			var _ref$tokenDuration = _ref.tokenDuration;
			var tokenDuration = _ref$tokenDuration === undefined ? this.tokenDuration : _ref$tokenDuration;

			return this.request({ uri: '/oauth/token', form: {
					username: username,
					password: password,
					grant_type: 'password',
					client_id: this.clientId,
					client_secret: this.clientSecret,
					expires_in: tokenDuration
				}, method: 'post' });
		}

		/**
   * Create a user account for the Particle Cloud
   * @param  {String} $0.username Email of the new user
   * @param  {String} $0.password Password
   * @return {Promise}
   */

	}, {
		key: 'createUser',
		value: function createUser(_ref2) {
			var username = _ref2.username;
			var password = _ref2.password;

			return this.post('/v1/users', {
				username: username, password: password
			});
		}

		/**
   * Send reset password email for a Particle Cloud user account
   * @param  {String} $0.username Email of the user
   * @return {Promise}
   */

	}, {
		key: 'resetPassword',
		value: function resetPassword(_ref3) {
			var username = _ref3.username;

			return this.post('/v1/user/password-reset', { username: username });
		}

		/**
   * Revoke an access token
   * @param  {String} $0.username Username of the Particle cloud account that the token belongs to.
   * @param  {String} $0.password Password for the account
   * @param  {String} $0.token    Access token you wish to revoke
   * @return {Promise}
   */

	}, {
		key: 'removeAccessToken',
		value: function removeAccessToken(_ref4) {
			var username = _ref4.username;
			var password = _ref4.password;
			var token = _ref4.token;

			return this.delete('/v1/access_tokens/' + token, {
				access_token: token
			}, { username: username, password: password });
		}

		/**
   * List all valid access tokens for a Particle Cloud account
   * @param  {String} $0.username Username
   * @param  {String} $0.password Password
   * @return {Promise}
   */

	}, {
		key: 'listAccessTokens',
		value: function listAccessTokens(_ref5) {
			var username = _ref5.username;
			var password = _ref5.password;

			return this.get('/v1/access_tokens', { username: username, password: password });
		}

		/**
   * List devices claimed to the account
   * @param  {String} $0.auth Access Token
   * @return {Promise}
   */

	}, {
		key: 'listDevices',
		value: function listDevices(_ref6) {
			var auth = _ref6.auth;

			return this.get('/v1/devices', auth);
		}

		/**
   * Get detailed informationa about a device
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.auth     Access token
   * @return {Promise}
   */

	}, {
		key: 'getDevice',
		value: function getDevice(_ref7) {
			var deviceId = _ref7.deviceId;
			var auth = _ref7.auth;

			return this.get('/v1/devices/' + deviceId, auth);
		}

		/**
   * Claim a device to the account. The device must be online and unclaimed.
   * @param  {String} $0.deviceId Device ID
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'claimDevice',
		value: function claimDevice(_ref8) {
			var deviceId = _ref8.deviceId;
			var requestTransfer = _ref8.requestTransfer;
			var auth = _ref8.auth;

			return this.post('/v1/devices', {
				id: deviceId,
				request_transfer: !!requestTransfer
			}, auth);
		}

		/**
   * Unclaim / Remove a device from your account
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'removeDevice',
		value: function removeDevice(_ref9) {
			var deviceId = _ref9.deviceId;
			var auth = _ref9.auth;

			return this.delete('/v1/devices/' + deviceId, null, auth);
		}

		/**
   * Rename a device
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.name     Desired Name
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'renameDevice',
		value: function renameDevice(_ref10) {
			var deviceId = _ref10.deviceId;
			var name = _ref10.name;
			var auth = _ref10.auth;

			return this.put('/v1/devices/' + deviceId, { name: name }, auth);
		}

		/**
   * Generate a claim code to use in the device claiming process.
   * @param  {String} $0.auth  Access Token
   * @param  {String} [$0.iccid] ICCID of the SIM card used in the Electron
   * @return {Promise}
   */

	}, {
		key: 'getClaimCode',
		value: function getClaimCode(_ref11) {
			var auth = _ref11.auth;
			var _ref11$iccid = _ref11.iccid;
			var iccid = _ref11$iccid === undefined ? undefined : _ref11$iccid;

			return this.post('/v1/device_claims', { iccid: iccid }, auth);
		}
	}, {
		key: 'validatePromoCode',
		value: function validatePromoCode(_ref12) {
			var auth = _ref12.auth;
			var promoCode = _ref12.promoCode;

			return this.get('/v1/promo_code/' + promoCode, auth);
		}
	}, {
		key: 'changeProduct',
		value: function changeProduct(_ref13) {
			var deviceId = _ref13.deviceId;
			var productId = _ref13.productId;
			var shouldUpdate = _ref13.shouldUpdate;
			var auth = _ref13.auth;

			return this.put('/v1/devices/' + deviceId, {
				product_id: productId,
				update_after_claim: shouldUpdate || false
			}, auth);
		}

		/**
   * Get the value of a device variable
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.name     Variable name
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'getVariable',
		value: function getVariable(_ref14) {
			var deviceId = _ref14.deviceId;
			var name = _ref14.name;
			var auth = _ref14.auth;

			return this.get('/v1/devices/' + deviceId + '/' + name, auth);
		}

		/**
   * Instruct the device to turn on/off the LED in a rainbow pattern
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {Boolean} $0.signal   Signal on or off
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'signalDevice',
		value: function signalDevice(_ref15) {
			var deviceId = _ref15.deviceId;
			var signal = _ref15.signal;
			var auth = _ref15.auth;

			return this.put('/v1/devices/' + deviceId, {
				signal: !!signal ? '1' : '0'
			}, auth);
		}

		/**
   * Compile and flash application firmware to a device
   * @param  {String} $0.deviceId      Device ID or Name
   * @param  {Object} $0.files         Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
   * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
   * @param  {String} $0.auth          String
   * @return {Promise}
   */

	}, {
		key: 'flashDevice',
		value: function flashDevice(_ref16) {
			var deviceId = _ref16.deviceId;
			var files = _ref16.files;
			var targetVersion = _ref16.targetVersion;
			var auth = _ref16.auth;

			var form = {};
			if (targetVersion) {
				form.build_target_version = targetVersion;
			} else {
				form.latest = 'true';
			}
			return this.request({ uri: '/v1/devices/' + deviceId,
				files: files, auth: auth, form: form, method: 'put' });
		}

		/**
   * Flash the Tinker application to a device
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'flashTinker',
		value: function flashTinker(_ref17) {
			var deviceId = _ref17.deviceId;
			var auth = _ref17.auth;

			return this.put('/v1/devices/' + deviceId, {
				app: 'tinker'
			}, auth);
		}

		/**
   * Compile firmware using the Particle Cloud
   * @param  {Object} $0.files         Object containing files to be compiled. Keys should be the filenames, and the values should be a path or Buffer of the file contents.
   * @param  {Number} [$0.platformId]    Platform id number of the device you are compiling for. Common values are 0=Core, 6=Photon, 10=Electron.
   * @param  {String} [$0.targetVersion=latest] System firmware version to compile against
   * @param  {String} $0.auth          Access Token
   * @return {Promise}
   */

	}, {
		key: 'compileCode',
		value: function compileCode(_ref18) {
			var files = _ref18.files;
			var platformId = _ref18.platformId;
			var targetVersion = _ref18.targetVersion;
			var auth = _ref18.auth;

			var form = { platform_id: platformId };
			if (targetVersion) {
				form.build_target_version = targetVersion;
			} else {
				form.latest = 'true';
			}
			return this.request({ uri: '/v1/binaries',
				files: files, auth: auth, form: form, method: 'post' });
		}

		/**
   * Download a firmware binary
   * @param  {String} $0.binaryId Binary ID received from a successful compile call
   * @param  {String} $0.auth     Access Token
   * @return {Request}
   */

	}, {
		key: 'downloadFirmwareBinary',
		value: function downloadFirmwareBinary(_ref19) {
			var binaryId = _ref19.binaryId;
			var auth = _ref19.auth;

			var uri = '/v1/binaries/' + binaryId;
			var req = (0, _superagent2.default)('get', uri);
			req.use(this.prefix);
			this.headers(req, auth);
			if (this.debug) {
				this.debug(req);
			}
			return req;
		}

		/**
   * Send a new device public key to the Particle Cloud
   * @param  {String} $0.deviceId  Device ID or Name
   * @param  {(String|Buffer)} $0.key       Public key contents
   * @param  {String} [$0.algorithm=rsa] Algorithm used to generate the public key. Valid values are `rsa` or `ecc`.
   * @param  {String} $0.auth      Access Token
   * @return {Promise}
   */

	}, {
		key: 'sendPublicKey',
		value: function sendPublicKey(_ref20) {
			var deviceId = _ref20.deviceId;
			var key = _ref20.key;
			var algorithm = _ref20.algorithm;
			var auth = _ref20.auth;

			return this.post('/v1/provisioning/' + deviceId, {
				deviceID: deviceId,
				publicKey: typeof key === 'string' ? key : key.toString(),
				filename: 'particle-api',
				order: 'manual_' + Date.now(),
				algorithm: algorithm || 'rsa'
			}, auth);
		}

		/**
   * Call a device function
   * @param  {String} $0.deviceId Device ID or Name
   * @param  {String} $0.name     Function name
   * @param  {String} $0.argument Function argument
   * @param  {String} $0.auth     Access Token
   * @return {Promise}
   */

	}, {
		key: 'callFunction',
		value: function callFunction(_ref21) {
			var deviceId = _ref21.deviceId;
			var name = _ref21.name;
			var argument = _ref21.argument;
			var auth = _ref21.auth;

			return this.post('/v1/devices/' + deviceId + '/' + name, {
				args: argument
			}, auth);
		}

		/**
   * Get a stream of events
   * @param  {String} [$0.deviceId] Device ID or Name, or `mine` to indicate only your devices.
   * @param  {String} [$0.name]     Event Name
   * @param  {String} [$0.org]     Organization Slug
   * @param  {String} [$0.product]     Product Slug or Product ID
   * @param  {String} $0.auth     Access Token
   * @return {Promise} If the promise resolves, the resolution value will be an EventStream object that will
   * emit 'event' events, as well as the specific named event.
   */

	}, {
		key: 'getEventStream',
		value: function getEventStream(_ref22) {
			var deviceId = _ref22.deviceId;
			var name = _ref22.name;
			var org = _ref22.org;
			var product = _ref22.product;
			var auth = _ref22.auth;

			var uri = '/v1/';
			if (org) {
				uri += 'orgs/' + org + '/';
			}

			if (product) {
				uri += 'products/' + product + '/';
			}

			if (deviceId) {
				uri += 'devices/';
				if (!(deviceId.toLowerCase() === 'mine')) {
					uri += deviceId + '/';
				}
			}

			uri += 'events';

			if (name) {
				uri += '/' + encodeURIComponent(name);
			}

			return new _EventStream2.default('' + this.baseUrl + uri, auth, { debug: this.debug }).connect();
		}

		/**
   * Publish a event to the Particle Cloud
   * @param  {String} $0.name      Event name
   * @param  {String} $0.data      Event data
   * @param  {Boolean} $0.isPrivate Should the event be publicly available?
   * @param  {String} $0.auth      Access Token
   * @return {Promise}
   */

	}, {
		key: 'publishEvent',
		value: function publishEvent(_ref23) {
			var name = _ref23.name;
			var data = _ref23.data;
			var isPrivate = _ref23.isPrivate;
			var auth = _ref23.auth;

			return this.post('/v1/devices/events', {
				name: name,
				data: data,
				'private': isPrivate
			}, auth);
		}

		/**
   * Create a webhook
   * @param  {String} $0.deviceId           Device ID or Name
   * @param  {String} $0.name               Webhook name
   * @param  {String} $0.url                URL the webhook should hit
   * @param  {String} [$0.requestType=POST]        HTTP method to use
   * @param  {Object} [$0.headers]            Additional headers to add to the webhook
   * @param  {Object} [$0.json]               JSON data
   * @param  {Object} [$0.query]              Query string data
   * @param  {Object} [$0.responseTemplate]   Webhook response template
   * @param  {Object} [$0.responseTopic]      Webhook response topic
   * @param  {Boolean} [$0.rejectUnauthorized] Reject invalid HTTPS certificates
   * @param  {Object} [$0.webhookAuth]        HTTP Basic Auth information
   * @param  {Object} [$0.form]               Form data
   * @param  {String} $0.auth               Access Token
   * @return {Promise}
   */

	}, {
		key: 'createWebhook',
		value: function createWebhook(_ref24) {
			var deviceId = _ref24.deviceId;
			var name = _ref24.name;
			var url = _ref24.url;
			var requestType = _ref24.requestType;
			var headers = _ref24.headers;
			var json = _ref24.json;
			var query = _ref24.query;
			var responseTemplate = _ref24.responseTemplate;
			var responseTopic = _ref24.responseTopic;
			var rejectUnauthorized = _ref24.rejectUnauthorized;
			var webhookAuth = _ref24.webhookAuth;
			var form = _ref24.form;
			var auth = _ref24.auth;

			var data = { event: name, url: url, requestType: requestType, headers: headers, json: json, query: query, responseTemplate: responseTemplate, responseTopic: responseTopic, rejectUnauthorized: rejectUnauthorized, auth: webhookAuth, form: form };
			if (deviceId === 'mine') {
				data.mydevices = true;
			} else {
				data.deviceid = deviceId;
			}
			return this.post('/v1/webhooks', data, auth);
		}

		/**
   * Delete a webhook
   * @param  {String} $0.hookId Webhook ID
   * @param  {String} $0.auth   Access Token
   * @return {Promise}
   */

	}, {
		key: 'deleteWebhook',
		value: function deleteWebhook(_ref25) {
			var hookId = _ref25.hookId;
			var auth = _ref25.auth;

			return this.delete('/v1/webhooks/' + hookId, null, auth);
		}

		/**
   * List all webhooks owned by the account
   * @param  {String} $0.auth Access Token
   * @return {Promise}
   */

	}, {
		key: 'listWebhooks',
		value: function listWebhooks(_ref26) {
			var auth = _ref26.auth;

			return this.get('/v1/webhooks', auth);
		}

		/**
   * Get details about the current user
   * @param  {String} $0.auth Access Token
   * @return {Promise}
   */

	}, {
		key: 'getUserInfo',
		value: function getUserInfo(_ref27) {
			var auth = _ref27.auth;

			return this.get('/v1/user', auth);
		}
	}, {
		key: 'setUserInfo',
		value: function setUserInfo(_ref28) {
			var stripeToken = _ref28.stripeToken;
			var auth = _ref28.auth;

			return this.put('/v1/user', {
				stripe_token: stripeToken
			}, auth);
		}
	}, {
		key: 'checkSIM',
		value: function checkSIM(_ref29) {
			var iccid = _ref29.iccid;
			var auth = _ref29.auth;

			return this.head('/v1/sims/' + iccid, auth);
		}
	}, {
		key: 'activateSIM',
		value: function activateSIM(_ref30) {
			var iccid = _ref30.iccid;
			var countryCode = _ref30.countryCode;
			var promoCode = _ref30.promoCode;
			var auth = _ref30.auth;

			return this.put('/v1/sims/' + iccid, {
				country: countryCode,
				promo_code: promoCode,
				action: 'activate'
			}, auth);
		}

		/**
   * List valid build targets to be used for compiling
   * @param  {String} $0.auth         Access Token
   * @param  {Boolean} [$0.onlyFeatured=false] Only list featured build targets
   * @return {Promise}
   */

	}, {
		key: 'listBuildTargets',
		value: function listBuildTargets(_ref31) {
			var auth = _ref31.auth;
			var _ref31$onlyFeatured = _ref31.onlyFeatured;
			var onlyFeatured = _ref31$onlyFeatured === undefined ? undefined : _ref31$onlyFeatured;

			var query = void 0;
			if (onlyFeatured !== undefined) {
				query = { featured: !!onlyFeatured };
			}
			return this.get('/v1/build_targets', auth, query);
		}

		/**
   * List firmware libraries
   * @param  {String} $0.auth Access Token
   * @param  {Number} $0.page Page index (default, first page)
   * @param  {Number} $0.limit Number of items per page
   * @param  {String} $0.filter Search term for the libraries
   * @param  {String} $0.sort Ordering key for the library list
   * @param  {Array<String>}  $0.architectures List of architectures to filter
   * @param  {String} $0.category Category to filter
   * @return {Promise}
   */

	}, {
		key: 'listLibraries',
		value: function listLibraries(_ref32) {
			var auth = _ref32.auth;
			var page = _ref32.page;
			var limit = _ref32.limit;
			var filter = _ref32.filter;
			var sort = _ref32.sort;
			var architectures = _ref32.architectures;
			var category = _ref32.category;

			return this.get('/v1/libraries', auth, {
				page: page,
				filter: filter,
				limit: limit,
				sort: sort,
				architectures: Array.isArray(architectures) ? architectures.join(',') : architectures,
				category: category
			});
		}

		/**
   * Get firmware library details
   * @param  {String} $0.auth Access Token
   * @param  {String} $0.name Name of the library to fetch
   * @param  {String} $0.version Version of the library to fetch (default: latest)
   * @return {Promise}
   */

	}, {
		key: 'getLibrary',
		value: function getLibrary(_ref33) {
			var auth = _ref33.auth;
			var name = _ref33.name;
			var version = _ref33.version;

			return this.get('/v1/libraries/' + name, auth, { version: version });
		}

		/**
   * Firmware library details for each version
   * @param  {String} $0.auth Access Token
   * @param  {String} $0.name Name of the library to fetch
   * @param  {Number} $0.page Page index (default, first page)
   * @param  {Number} $0.limit Number of items per page
   * @return {Promise}
   */

	}, {
		key: 'getLibraryVersions',
		value: function getLibraryVersions(_ref34) {
			var auth = _ref34.auth;
			var name = _ref34.name;
			var page = _ref34.page;
			var limit = _ref34.limit;

			return this.get('/v1/libraries/' + name + '/versions', auth, {
				page: page,
				limit: limit
			});
		}

		/**
   * Publish a new library version int the compressed archive
   * @param  {String} $0.auth Access Token
   * @param  {String} $0.archive Compressed archive file containing the library sources
   * @return {Promise}
   */

	}, {
		key: 'publishLibrary',
		value: function publishLibrary(_ref35) {
			var auth = _ref35.auth;
			var archive = _ref35.archive;

			var files = {
				'archive.tar.gz': archive
			};

			return this.request({ uri: '/v1/libraries',
				files: files, auth: auth, method: 'post' });
		}

		/**
   * Delete one version of a library or an entire published library
   * @param  {String} $0.auth Access Token
   * @param  {String} $0.name Name of the library to delete
   * @param  {String} $0.force Key to force deleting a public library
   * @return {Promise}
   */

	}, {
		key: 'deleteLibrary',
		value: function deleteLibrary(_ref36) {
			var auth = _ref36.auth;
			var name = _ref36.name;
			var force = _ref36.force;

			return this.delete('/v1/libraries/' + name, { force: force }, auth);
		}

		/**
   * Download an external file that may not be on the API
   * @param  {String} $0.url URL of the file.
   * @return {Promise} Resolves to a buffer with the file data
   */

	}, {
		key: 'downloadFile',
		value: function downloadFile(_ref37) {
			var url = _ref37.url;

			var req = _superagent2.default.get(url);
			if (req.buffer) {
				req = req.buffer(true).parse(_superagentBinaryParser2.default);
			} else if (req.responseType) {
				req = req.responseType('arraybuffer').then(function (res) {
					res.body = res.xhr.response;
					return res;
				});
			}
			return req.then(function (res) {
				return res.body;
			});
		}
	}, {
		key: 'get',
		value: function get(uri, auth) {
			var query = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

			return this.agent.get(uri, auth, query);
		}
	}, {
		key: 'head',
		value: function head(uri, auth) {
			return this.agent.head(uri, auth);
		}
	}, {
		key: 'post',
		value: function post(uri, data, auth) {
			return this.agent.post(uri, data, auth);
		}
	}, {
		key: 'put',
		value: function put(uri, data, auth) {
			return this.agent.put(uri, data, auth);
		}
	}, {
		key: 'delete',
		value: function _delete(uri, data, auth) {
			return this.agent.delete(uri, data, auth);
		}
	}, {
		key: 'request',
		value: function request(args) {
			return this.agent.request(args);
		}
	}, {
		key: 'client',
		value: function client() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			return new _Client2.default((0, _assign2.default)({ api: this }, options));
		}
	}]);
	return Particle;
}();

exports.default = Particle;
module.exports = exports['default'];
//# sourceMappingURL=Particle.js.map