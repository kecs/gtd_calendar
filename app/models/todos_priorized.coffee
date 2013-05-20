TodoPriorized = require 'models/todo_priorized'
Collection = require 'models/base/collection'


module.exports = class TodosPriorized extends Collection
  @model = TodoPriorized

  comparator: (model) -> model.get 'order'
  localStorage: new Backbone.LocalStorage 'gtd-todos-priorized'
  destroy: (model) ->
    @remove model
    @localStorage.destroy model
    model
