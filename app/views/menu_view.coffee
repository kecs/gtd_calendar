View = require 'views/base/view'
template = require 'views/templates/menu'

module.exports = class MenuView extends View
  template: template
  tagName: 'ul'
  className: 'nav'
  container: '#navbar'
  autoRender: true

  initialize: ->
    super
    @subscribeEvent 'startupController', @render
