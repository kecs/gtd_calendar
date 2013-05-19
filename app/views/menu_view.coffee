View = require 'views/base/view'
template = require 'views/templates/menu'
mediator = require 'mediator'

module.exports = class MenuView extends View
  template: template
  tagName: 'ul'
  className: 'nav'
  container: '#navbar'
  autoRender: yes

  initialize: ->
    super
    mediator.subscribe 'route', (href) => @activate href 
    @delegate 'click', 'a:not([class="brand"])', @navigate

  navigate: (e) ->
    e.preventDefault()
    e.stopPropagation()
    try
      href = e.target.getAttribute 'href'
      mediator.router.route href
    catch err
      console?.log err

  activate: (href) ->   
    ((@$el.find """a[href="#{ href }"]""")
    .parent().addClass 'active')
    .siblings().removeClass 'active'
    

