template = require 'views/templates/weekly'
View = require 'views/base/view'
mediator = require 'mediator'
__ = (args...) -> console.log '[*] ', args...


module.exports = class WeeklyView extends View
  template: template
  container: '#todo-list'
  autoRender: on

  initialize: ->
    super
    Handlebars.registerHelper 'getDueDate', @getDueDate
    __ @collection.sort

    @on 'addedToDOM', =>
      (@$el.find 'ul').slideDown()
      .css('user-select', 'none')
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
 
  render: (e, ui) ->
    super

  detail: (e) =>
    e.stopPropagation()
    title = clear @$(e.target).parent('li').text()
    model = @collection.where(title: title)[0]
    @subview 'detail', new DetailView
      model: model
      parentView: @

  disallowEdit: ->
    (@$el.find 'ul').sortable(
      'option', 'disabled', on
    )
    .find('li').off 'mouseenter mouseleave'

  getDueDate: (todo) ->
    $.datepicker.formatDate 'd MM yy', new Date todo.dueDate
