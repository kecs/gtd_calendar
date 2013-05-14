template = require 'views/templates/collect'
View = require 'views/base/view'

module.exports = class CollectView extends View
  template: template
  container: '#todo-list'
