template = require 'views/templates/priorize'
View = require 'views/base/view'

module.exports = class PriorizeView extends View
  template: template
  container: '#todo-list'
