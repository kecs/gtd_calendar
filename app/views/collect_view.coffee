template = require 'views/templates/collect'
View = require 'views/base/view'

module.exports = class CollectView extends View
  template: template
  container: '#todo-list'
  autoRender: on

  initialize: ->
    super
    @delegate 'focus', 'input', @focus
    @delegate 'blur', 'input', @addTodo

  focus: (event) ->
    unbind = (e) =>
      if e.which is 13
        @$(event.target).off('keyup').trigger 'blur'
        
    @$(event.target).on 'keyup', unbind

  addTodo: ->
    title = (@$el.find 'input').val()
    @collection.create title: title
    @render()



