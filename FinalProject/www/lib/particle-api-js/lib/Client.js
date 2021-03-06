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

var _Particle = require('./Particle');

var _Particle2 = _interopRequireDefault(_Particle);

var _Library = require('./Library');

var _Library2 = _interopRequireDefault(_Library);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Client = function () {
	function Client(_ref) {
		var auth = _ref.auth;
		var _ref$api = _ref.api;
		var api = _ref$api === undefined ? new _Particle2.default() : _ref$api;
		(0, _classCallCheck3.default)(this, Client);

		(0, _assign2.default)(this, { auth: auth, api: api });
	}

	/**
  * Get firmware library objects
  * @param  {Object} query The query parameters for libraries. See Particle.listLibraries
  * @return {Promise}
  */


	(0, _createClass3.default)(Client, [{
		key: 'libraries',
		value: function libraries() {
			var _this = this;

			var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			return this.api.listLibraries((0, _assign2.default)({}, query, { auth: this.auth })).then(function (payload) {
				var libraries = payload.body.data || [];
				return libraries.map(function (l) {
					return new _Library2.default(_this, l);
				});
			});
		}

		/**
   * Get one firmware library object
   * @param  {String} name Name of the library to fetch
   * @param  {Object} query The query parameters for libraries. See Particle.getLibrary
   * @return {Promise}
   */

	}, {
		key: 'library',
		value: function library(name) {
			var _this2 = this;

			var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			return this.api.getLibrary((0, _assign2.default)({}, query, { name: name, auth: this.auth })).then(function (payload) {
				var library = payload.body.data || {};
				return new _Library2.default(_this2, library);
			});
		}

		/**
   * Publish a new library version
   * @param  {Buffer} archive The compressed archive with the library source
   * @return {Promise}
   */

	}, {
		key: 'publishLibrary',
		value: function publishLibrary(archive) {
			var _this3 = this;

			return this.api.publishLibrary({ archive: archive, auth: this.auth }).then(function (payload) {
				var library = payload.body.data || {};
				return new _Library2.default(_this3, library);
			}, function (error) {
				_this3._throwError(error);
			});
		}

		/**
   * Delete an entire published library
   * @param  {String} $0.name Name of the library to delete
   * @param  {String} $0.force Key to force deleting a public library
   * @return {Promise}
   */

	}, {
		key: 'deleteLibrary',
		value: function deleteLibrary(_ref2) {
			var _this4 = this;

			var name = _ref2.name;
			var version = _ref2.version;
			var force = _ref2.force;

			return this.api.deleteLibrary({ name: name, force: force, auth: this.auth }).then(function (payload) {
				return true;
			}, function (error) {
				_this4._throwError(error);
			});
		}
	}, {
		key: '_throwError',
		value: function _throwError(error) {
			if (error.body && error.body.errors) {
				var errorMessages = error.body.errors.map(function (e) {
					return e.message;
				}).join('\n');
				throw new Error(errorMessages);
			}
			throw error;
		}
	}, {
		key: 'downloadFile',
		value: function downloadFile(url) {
			return this.api.downloadFile({ url: url });
		}
	}, {
		key: 'compileCode',
		value: function compileCode(files, platformId, targetVersion) {
			return this.api.compileCode({ files: files, platformId: platformId, targetVersion: targetVersion, auth: this.auth });
		}
	}]);
	return Client;
}();

exports.default = Client;
module.exports = exports['default'];
//# sourceMappingURL=Client.js.map