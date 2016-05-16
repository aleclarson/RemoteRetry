var Network, Retry, Type, assert, type;

require("isReactNative");

Network = require("network");

assert = require("assert");

Retry = require("retry");

Type = require("Type");

type = Type("RemoteRetry");

type.inherits(Retry);

type.initInstance(function() {
  return assert(isReactNative, "Remote retries are only supported in React Native!");
});

type.defineValues({
  _networkListener: null
});

type.bindMethods(["_onNetworkConnected"]);

type.defineMethods({
  reset: function() {
    if (this._networkListener != null) {
      this._networkListener.stop();
      this._networkListener = null;
    }
    return Retry.prototype.reset.call(this);
  },
  _onNetworkConnected: function() {
    this._networkListener = null;
    return Retry.prototype._retry.call(this);
  },
  _shouldRetry: function() {
    if (Network.isConnected) {
      return true;
    }
    this._networkListener = Network.didConnect.once(this._onNetworkConnected);
    return false;
  },
  _retry: function() {
    if (!this._shouldRetry()) {
      return;
    }
    return Retry.prototype._retry.call(this);
  }
});

module.exports = type.build();

//# sourceMappingURL=../../map/src/RemoteRetry.map
