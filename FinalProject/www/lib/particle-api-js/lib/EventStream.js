'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isNan = require('babel-runtime/core-js/number/is-nan');

var _isNan2 = _interopRequireDefault(_isNan);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-depth: 0 */
var EventStream = function (_EventEmitter) {
	(0, _inherits3.default)(EventStream, _EventEmitter);

	function EventStream(uri, token, options) {
		(0, _classCallCheck3.default)(this, EventStream);

		var _this = (0, _possibleConstructorReturn3.default)(this, (EventStream.__proto__ || (0, _getPrototypeOf2.default)(EventStream)).call(this));

		_this.uri = uri;
		_this.token = token;
		_this.reconnectInterval = 2000;
		(0, _assign2.default)(_this, options);
		return _this;
	}

	(0, _createClass3.default)(EventStream, [{
		key: 'connect',
		value: function connect() {
			var _this2 = this;

			return new _promise2.default(function (resolve, reject) {
				var _url$parse = _url2.default.parse(_this2.uri);

				var hostname = _url$parse.hostname;
				var protocol = _url$parse.protocol;
				var port = _url$parse.port;
				var path = _url$parse.path;

				_this2.origin = protocol + '//' + hostname + (port ? ':' + port : '');

				var isSecure = protocol === 'https:';
				var requestor = isSecure ? _https2.default : _http2.default;
				var req = requestor.request({
					hostname: hostname,
					protocol: protocol,
					path: path + '?history_limit=30&access_token=' + _this2.token,
					method: 'get',
					port: port || (isSecure ? 443 : 80),
					avoidFetch: true,
					mode: 'prefer-streaming'
				});

				_this2.req = req;
				if (_this2.debug) {
					_this2.debug(_this2);
				}

				req.on('error', function (e) {
					reject({ error: e, errorDescription: 'Network error from ' + _this2.uri });
				});

				req.on('response', function (res) {
					var statusCode = res.statusCode;
					if (statusCode !== 200) {
						var _ret = function () {
							var body = '';
							res.on('data', function (chunk) {
								return body += chunk;
							});
							res.on('end', function () {
								try {
									body = JSON.parse(body);
								} catch (e) {}
								_this2.emit('response', {
									statusCode: statusCode,
									body: body
								});
								var errorDescription = 'HTTP error ' + statusCode + ' from ' + _this2.uri;
								if (body && body.error_description) {
									errorDescription += ' - ' + body.error_description;
								}
								reject({ statusCode: statusCode, errorDescription: errorDescription, body: body });
								_this2.req = undefined;
							});
							return {
								v: void 0
							};
						}();

						if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
					}

					_this2.data = '';
					_this2.buf = '';
					_this2.eventName;
					_this2.lastEventId;

					res.on('data', _this2.parse.bind(_this2));
					res.once('end', _this2.end.bind(_this2));
					resolve(_this2);
				});
				req.end();
			});
		}
	}, {
		key: 'abort',
		value: function abort() {
			if (this.req) {
				this.req.abort();
				this.req = undefined;
			}
			this.removeAllListeners();
		}
	}, {
		key: 'end',
		value: function end() {
			var _this3 = this;

			this.req = undefined;
			setTimeout(function () {
				_this3.connect().catch(function (err) {
					_this3.emit('error', err);
					_this3.removeAllListeners();
				});
			}, this.reconnectInterval);
		}
	}, {
		key: 'parse',
		value: function parse(chunk) {
			this.buf += chunk;
			var pos = 0;
			var length = this.buf.length;
			var discardTrailingNewline = false;

			while (pos < length) {
				if (discardTrailingNewline) {
					if (this.buf[pos] === '\n') {
						++pos;
					}
					discardTrailingNewline = false;
				}

				var lineLength = -1;
				var fieldLength = -1;

				for (var i = pos; lineLength < 0 && i < length; ++i) {
					var c = this.buf[i];
					if (c === ':') {
						if (fieldLength < 0) {
							fieldLength = i - pos;
						}
					} else if (c === '\r') {
						discardTrailingNewline = true;
						lineLength = i - pos;
					} else if (c === '\n') {
						lineLength = i - pos;
					}
				}

				if (lineLength < 0) {
					break;
				}

				this.parseEventStreamLine(pos, fieldLength, lineLength);

				pos += lineLength + 1;
			}

			if (pos === length) {
				this.buf = '';
			} else if (pos > 0) {
				this.buf = this.buf.slice(pos);
			}
		}
	}, {
		key: 'parseEventStreamLine',
		value: function parseEventStreamLine(pos, fieldLength, lineLength) {
			if (lineLength === 0) {
				try {
					if (this.data.length > 0 && this.event) {
						var event = JSON.parse(this.data);
						event.name = this.eventName || '';
						if (this.eventName !== 'event') {
							this.emit(this.eventName, event);
						}
						this.emit('event', event);
						this.data = '';
					}
					this.eventName = undefined;
					this.event = false;
				} catch (e) {
					// do nothing if JSON.parse fails
				}
			} else if (fieldLength > 0) {
				var field = this.buf.slice(pos, pos + fieldLength);
				var step = 0;

				if (this.buf[pos + fieldLength + 1] !== ' ') {
					step = fieldLength + 1;
				} else {
					step = fieldLength + 2;
				}
				pos += step;
				var valueLength = lineLength - step;
				var value = this.buf.slice(pos, pos + valueLength);

				if (field === 'data') {
					this.data += value + '\n';
				} else if (field === 'event') {
					this.eventName = value;
					this.event = true;
				} else if (field === 'id') {
					this.lastEventId = value;
				} else if (field === 'retry') {
					var retry = parseInt(value, 10);
					if (!(0, _isNan2.default)(retry)) {
						this.reconnectInterval = retry;
					}
				}
			}
		}
	}]);
	return EventStream;
}(_events.EventEmitter);

exports.default = EventStream;
module.exports = exports['default'];
//# sourceMappingURL=EventStream.js.map