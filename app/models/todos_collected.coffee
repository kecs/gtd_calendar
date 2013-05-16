Collection = require 'models/base/collection'
TodoCollected = require 'models/todo_collected'
#LocalStorage = require 'lib/backbone.localStorage'


module.exports = class TodosCollected extends Collection
  @model = TodoCollected

  localStorage: new Backbone.LocalStorage 'gtd-todos-collected'

