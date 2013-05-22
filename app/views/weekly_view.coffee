template = require 'views/templates/weekly'
View = require 'views/base/view'
mediator = require 'mediator'
DetailView = require 'views/detail'
__ = (args...) -> console.log '[*] ', args...

clear = (text) ->
  (/(\w+.*\w+)\s\(/gi.exec text)[1]


module.exports = class WeeklyView extends View
  template: template
  container: '#todo-list'
  autoRender: on

  initialize: ->
    super
    @collection.__proto__.comparator = (todo) ->
      todo.get 'dueDate'
    @collection.sort()

    Handlebars.registerHelper 'getDueDate', @getDueDate
    
    @on 'addedToDOM', =>
      (@$el.find 'ul').slideDown()
      .css('user-select', 'none')

  render: ->
    super
    @allowEdit()

  allowEdit: ->
    (@$el.find 'ul').find('li').hover(
      (e) =>
        (@$ e.target).css('backgroundColor', 'AliceBlue')
        .find('i').show()
      ,
      (e) =>
        (@$ e.target).css('backgroundColor', 'white')
        .find('i').hide()
    )
    .stop().find('i').click @detail
 
  detail: (e) =>
    title = clear @$(e.target).parent('li').text()
    model = @collection.where(title: title)[0]
    @subview 'detail', new DetailView
      model: model
      parentView: @

  disallowEdit: ->
    (@$el.find 'ul').find('li').off 'mouseenter mouseleave'

  getDueDate: (todo) ->
    $.datepicker.formatDate 'd MM yy', new Date todo.dueDate
