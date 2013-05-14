template = require 'views/templates/weekly'
View = require 'views/base/view'

module.exports = class WeeklyView extends View
  template: template
  container: '#todo-list'
