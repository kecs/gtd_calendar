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

    @delegate('click', 'a:not([class="brand"])', @navigate)

  navigate: (e) ->
    e.preventDefault()
    console.log e.target.getAttribute('href')
    

