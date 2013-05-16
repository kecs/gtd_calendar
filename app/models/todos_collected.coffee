Collection = require 'models/base/collection'
TodoCollected = require 'models/todo_collected'

module.exports = class TodosCollected extends Collection
  @model = TodoCollected

