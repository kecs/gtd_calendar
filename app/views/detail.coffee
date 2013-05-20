View = require 'views/base/view'
template = require 'views/templates/detail'
__ = (args...) -> console.log '[*] ', args...

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
    @on 'addedToDOM', =>
      (@$el.find 'input').focus()
      (@$el.find 'i.icon-remove').click @remove
      (@$el.find 'i.icon-ok').click @done

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
