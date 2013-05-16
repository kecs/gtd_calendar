Model = require 'models/base/model'

module.exports = class TodoCollected extends Model
  initialize: ->
    super

  validate: ->
    msg = null
    msg = 'Supply title!' unless @title
    
    if msg? then console?.log msg
    msg
