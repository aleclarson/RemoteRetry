
require "isReactNative"

{ assert } = require "type-utils"

Network = require "network"
Retry = require "Retry"
Type = require "Type"

type = Type "RemoteRetry"

type.inherits Retry

type.initInstance ->
  assert isReactNative, "Remote retries are only supported in React Native!"

type.defineValues

  _networkListener: null

type.bindMethods [
  "_onNetworkConnected"
]

type.defineMethods

  reset: ->
    if @_networkListener?
      @_networkListener.stop()
      @_networkListener = null
    Retry::reset.call this

  _onNetworkConnected: ->
    @_networkListener = null
    Retry::_retry.call this

  _shouldRetry: ->
    return yes if Network.isConnected
    @_networkListener = Network.didConnect.once @_onNetworkConnected
    return no

  _retry: ->
    return unless @_shouldRetry()
    Reset::_retry.call this

module.exports = type.build()
