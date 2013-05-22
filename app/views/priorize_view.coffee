template = require 'views/templates/prioritize'
View = require 'views/base/view'
mediator = require 'mediator'
DetailView = require 'views/detail'
__ = (args...) -> console.log '[*] ', args...


clear = (text) ->
  (/\w+.*\w+/gi.exec text)[0]


module.exports = class PrioritizeView extends View
  template: template
  container: '#todo-list'
  className: 'prioritize'
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
          order: max + i + 1
          moved: no
        
    mediator.collected.each (todo) -> todo.destroy()
    
    @collection.reset @collection.filter (todo) ->
      dueDate = new Date todo.get 'dueDate'
      tomorrow = new Date(Date.now() + 1000*60*60*24) 
      dueDate < tomorrow

    @on 'addedToDOM', =>
      (@$el.find 'ul').slideDown()
      .css 'user-select', 'none'

  reorder: (e, ui) =>
    (@$el.find 'li').each (i, el) =>
      text = (@$ el).text()
      title = clear text
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
      disabled: off

    @allowEdit()

  detail: (e) =>
    e.stopPropagation()
    title = clear @$(e.target).parent('li').text()
    model = @collection.where(title: title)[0]
    @subview 'detail', new DetailView
      model: model
      parentView: @

  allowEdit: ->
    (@$el.find 'ul').sortable(
      'option', 'disabled', off
    )
    .find('li').hover(
      (e) =>
        (@$ e.target).css('backgroundColor', 'AliceBlue')
        .find('i').show()
      ,
      (e) =>
        (@$ e.target).css('backgroundColor', 'white')
        .find('i').hide()
      )
      .stop().find('i').click @detail

  disallowEdit: ->
    (@$el.find 'ul').sortable(
      'option', 'disabled', on
    )
    .find('li').off 'mouseenter mouseleave'
