'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPrefix = require('superagent-prefix');

var _superagentPrefix2 = _interopRequireDefault(_superagentPrefix);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Agent = function () {
	function Agent(baseUrl) {
		(0, _classCallCheck3.default)(this, Agent);

		this.prefix = (0, _superagentPrefix2.default)(baseUrl);
	}

	(0, _createClass3.default)(Agent, [{
		key: 'get',
		value: function get(uri, auth, query) {
			return this.request({ uri: uri, auth: auth, method: 'get', query: query });
		}
	}, {
		key: 'head',
		value: function head(uri, auth) {
			return this.request({ uri: uri, auth: auth, method: 'head' });
		}
	}, {
		key: 'post',
		value: function post(uri, data, auth) {
			return this.request({ uri: uri, data: data, auth: auth, method: 'post' });
		}
	}, {
		key: 'put',
		value: function put(uri, data, auth) {
			return this.request({ uri: uri, data: data, auth: auth, method: 'put' });
		}
	}, {
		key: 'delete',
		value: function _delete(uri, data, auth) {
			return this.request({ uri: uri, data: data, auth: auth, method: 'delete' });
		}

		/**
   *
   * @param {String} uri           The URI to request
   * @param {String} method        The method used to request the URI, should be in uppercase.
   * @param {String} data          Arbitrary data to send as the body.
   * @param {Object} auth          Authorization
   * @param {String} query         Query parameters
   * @param {Object} form          Form fields
   * @param {Object} files         array of file names and file content
   * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error, body }
   */

	}, {
		key: 'request',
		value: function request(_ref) {
			var uri = _ref.uri;
			var method = _ref.method;
			var _ref$data = _ref.data;
			var data = _ref$data === undefined ? undefined : _ref$data;
			var auth = _ref.auth;
			var _ref$query = _ref.query;
			var query = _ref$query === undefined ? undefined : _ref$query;
			var _ref$form = _ref.form;
			var form = _ref$form === undefined ? undefined : _ref$form;
			var _ref$files = _ref.files;
			var files = _ref$files === undefined ? undefined : _ref$files;

			var requestFiles = this._sanitizeFiles(files);
			return this._request({ uri: uri, method: method, data: data, auth: auth, query: query, form: form, files: requestFiles });
		}

		/**
   *
   * @param {String} uri           The URI to request
   * @param {String} method        The method used to request the URI, should be in uppercase.
   * @param {String} data          Arbitrary data to send as the body.
   * @param {Object} auth          Authorization
   * @param {String} query         Query parameters
   * @param {Object} form          Form fields
   * @param {Object} files         array of file names and file content
   * @return {Promise} A promise. fulfilled with {body, statusCode}, rejected with { statusCode, errorDescription, error, body }
   */

	}, {
		key: '_request',
		value: function _request(_ref2) {
			var uri = _ref2.uri;
			var method = _ref2.method;
			var data = _ref2.data;
			var auth = _ref2.auth;
			var query = _ref2.query;
			var form = _ref2.form;
			var files = _ref2.files;

			var req = this._buildRequest({ uri: uri, method: method, data: data, auth: auth, query: query, form: form, files: files });
			return this._promiseResponse(req);
		}

		/**
   * Promises to send the request and retreive the response.
   * @param {Request} req The request to send
   * @returns {Promise}   The promise to send the request and retrieve the response.
   * @private
   */

	}, {
		key: '_promiseResponse',
		value: function _promiseResponse(req) {
			var _this = this;

			return new _promise2.default(function (fulfill, reject) {
				return _this._sendRequest(req, fulfill, reject);
			});
		}

		/**
   * Sends the given request, calling the fulfill or reject methods for success/failure.
   * @param {object} request   The request to send
   * @param {function} fulfill    Called on success with the response
   * @param {function} reject     Called on failure with the failure reason.
   * @private
   * @returns {undefined} Nothing
   */

	}, {
		key: '_sendRequest',
		value: function _sendRequest(request, fulfill, reject) {
			request.end(function (error, res) {
				var body = res && res.body;
				if (error) {
					var uri = request.url;
					var statusCode = error.status;
					var errorDescription = (statusCode ? 'HTTP error ' + statusCode : 'Network error') + ' from ' + uri;
					if (body && body.error_description) {
						errorDescription += ' - ' + body.error_description;
					}
					var reason = new Error(errorDescription);
					(0, _assign2.default)(reason, { statusCode: statusCode, errorDescription: errorDescription, error: error, body: body });
					reject(reason);
				} else {
					fulfill({
						body: body,
						statusCode: res.statusCode
					});
				}
			});
		}
	}, {
		key: '_buildRequest',
		value: function _buildRequest(_ref3) {
			var uri = _ref3.uri;
			var method = _ref3.method;
			var data = _ref3.data;
			var auth = _ref3.auth;
			var query = _ref3.query;
			var form = _ref3.form;
			var files = _ref3.files;
			var _ref3$makerequest = _ref3.makerequest;
			var makerequest = _ref3$makerequest === undefined ? _superagent2.default : _ref3$makerequest;

			var req = makerequest(method, uri);
			if (this.prefix) {
				req.use(this.prefix);
			}
			this._authorizationHeader(req, auth);
			if (query) {
				req.query(query);
			}
			if (files) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(files)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

						var name = _step$value[0];
						var file = _step$value[1];

						req._getFormData().append(name, file.data, {
							filename: file.path,
							relativePath: _path2.default.dirname(file.path)
						});
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				if (form) {
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = (0, _getIterator3.default)((0, _entries2.default)(form)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _step2$value = (0, _slicedToArray3.default)(_step2.value, 2);

							var name = _step2$value[0];
							var value = _step2$value[1];

							req.field(name, value);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} else if (form) {
				req.type('form');
				req.send(form);
			} else if (data) {
				req.send(data);
			}
			return req;
		}

		/**
   * Adds an authorization header.
   * @param {Request} req     The request to add the authorization header to.
   * @param {object|string}  auth    The authorization. Either a string authorization bearer token,
   *  or a username/password object.
   * @returns {Request} req   The original request.
   */

	}, {
		key: '_authorizationHeader',
		value: function _authorizationHeader(req, auth) {
			if (auth) {
				if (auth.username !== undefined) {
					req.auth(auth.username, auth.password);
				} else {
					req.set({ Authorization: 'Bearer ' + auth });
				}
			}
			return req;
		}

		/**
   *
   * @param {Array} files converts the file names to file, file1, file2.
   * @returns {object} the renamed files.
   */

	}, {
		key: '_sanitizeFiles',
		value: function _sanitizeFiles(files) {
			var requestFiles = void 0;
			if (files) {
				requestFiles = {};
				(0, _keys2.default)(files).forEach(function (k, i) {
					var name = i ? 'file' + (i + 1) : 'file';
					requestFiles[name] = {
						data: files[k],
						path: k
					};
				});
			}
			return requestFiles;
		}
	}]);
	return Agent;
}(); /*
      ******************************************************************************
      Copyright (c) 2016 Particle Industries, Inc.  All rights reserved.
     
      This program is free software; you can redistribute it and/or
      modify it under the terms of the GNU Lesser General Public
      License as published by the Free Software Foundation, either
      version 3 of the License, or (at your option) any later version.
     
      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
      Lesser General Public License for more details.
     
      You should have received a copy of the GNU Lesser General Public
      License along with this program; if not, see <http://www.gnu.org/licenses/>.
      ******************************************************************************
      */

exports.default = Agent;
module.exports = exports['default'];
//# sourceMappingURL=Agent.js.map