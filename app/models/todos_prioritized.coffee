TodoPrioritized = require 'models/todo_prioritized'
Collection = require 'models/base/collection'


module.exports = class TodosPrioritized extends Collection
  @model = TodoPrioritized

  comparator: (model) -> model.get 'order'
  localStorage: new Backbone.LocalStorage 'gtd-todos-prioritized'
  destroy: (model) ->
    @remove model
    @localStorage.destroy model
    model
