template = require 'views/templates/priorize'
View = require 'views/base/view'
mediator = require 'mediator'
__ = (args...) -> console.log '[*] ', args...


module.exports = class PriorizeView extends View
  template: template
  container: '#todo-list'
  autoRender: on

  initialize: ->
    super
    max = if max=(_.max @collection.pluck 'order') > 0 then max else 0
    mediator.collected.each (todo, i) =>
      title = todo.get 'title'
      unless (@collection.where title: title).length
        @collection.create
          title: title
          dueDate: Date.now()
          order: max + i
          moved: no
        
    mediator.collected.each (todo) -> todo.destroy()

    @on 'addedToDOM', => (@$el.find 'ul').slideDown()

  reorder: (e, ui) =>
    (@$el.find 'li').each (i, el) =>
      text = (@$ el).text()
      title = text.replace /\W+/gi, ''
      todo = (@collection.where title: title)[0]

      if ui.item.text() is text
        todo.save
          order: i
          moved: yes
      else
        todo.save order: i

    ui.item.css color: 'black'

  render: (e, ui) ->
    super
    (@$el.find 'ul').sortable
      cursor: 'move'
      axis: 'y'
      update: @reorder

      
        

        
