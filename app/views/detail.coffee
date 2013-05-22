View = require 'views/base/view'
template = require 'views/templates/detail'
__ = (args...) -> console.log '[*] ', args...

clear = (text) ->
  (/\w+.*\w+/gi.exec text)[0]

module.exports = class DetailView extends View
  template: template
  container: '#todo-detail'
  autoRender: on

  initialize: (options) ->
    super
    @parentView = options.parentView
    @parentView.disallowEdit()
    @delegate 'focus', 'input', @focus
    @delegate 'blur', 'input', @addFirstStep
    @delegate 'click', 'li i.icon-remove', @removeStep
      
    @on 'addedToDOM', =>
      (@$el.find 'input').focus()
      (@$el.find '#remove').click @remove
      (@$el.find 'i.icon-ok').click @done
      (@$el.find '#due-date').css('cursor', 'pointer')
      .click @setDueDate
      (@$el.find 'li').hover(
        (e) => @$(e.target).append '<i class="icon-remove"></i>'
        ,
        (e) => @$(e.target).find('i.icon-remove').remove()
      )

    Handlebars.registerHelper 'getDueDate', @getDueDate

  focus: (event) ->
    unbind = (e) =>
      if e.which is 13
        @$(event.target).off('keyup').trigger 'blur'
        
    @$(event.target).on 'keyup', unbind

  addFirstStep: (e) =>
    step = @$(e.target).val()
    firstSteps = (@model.get 'firstSteps') or []

    if not step or step in firstSteps then return

    firstSteps.push step
    @model.save firstSteps: firstSteps
    @render()
    
  remove: =>
    if confirm 'Really want to remove?'
      $("#todo-list li:contains('#{@model.get 'title'}')").remove()
      @parentView.collection.destroy @model
      @dispose()
      
  done: =>
    steps = @model.get 'firstSteps'
    unless (steps and steps.length)
      alert 'You must specify first steps!'
    else unless @model.get 'dueDate'
      alert 'You must set due date!'
    else
      @model.save moved: yes
      @parentView.allowEdit()

      $("#todo-list li:contains('#{@model.get 'title'}')")
      .css('color', 'black')
      .trigger 'mouseout' 

      @dispose()

  getDueDate: =>
    $.datepicker.formatDate 'd MM yy', new Date @model.get 'dueDate'

  setDueDate: =>
    $datepicker = $('#datepicker')
    $datepicker.datepicker onSelect: (date) =>
      dueDate = $.datepicker.parseDate('mm/dd/yy', date).getTime()
      @model.save dueDate: dueDate
      $datepicker.slideUp 'slow', @render

    $('a.ui-datepicker-next').append '<i class="icon-arrow-right"></i>'
    $('a.ui-datepicker-prev').append '<i class="icon-arrow-left"></i>'

  removeStep: (e) =>
    step = clear (@$ e.target).parent('li').detach().text()
    @model.save firstSteps: _.without (@model.get 'firstSteps'), step
    

