TodoCollected = require 'models/todo_collected'

module.exports = class TodoPriorized extends TodoCollected
  #firstSteps = []
  #dueDate = Date.now()
  
  #validate: ->
  #  msg = super
  #  msg = 'Supply first steps!' unless @firstSteps.length
  #  msg = 'Supply due date!' unless @dueDate

  #  if msg? then console?.log msg
  #  msg

