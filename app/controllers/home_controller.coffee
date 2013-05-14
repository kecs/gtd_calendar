Chaplin = require 'chaplin'
Controller = require 'controllers/base/controller'
PriorizeView = require 'views/priorize_view'
CollectView = require 'views/collect_view'
WeeklyView = require 'views/weekly_view'

module.exports = class HomeController extends Controller
  historyURL: ''

  priorize: ->
    @view = new PriorizeView()
    Chaplin.mediator.publish 'route', 'priorize'

  collect: ->
    @view = new CollectView()
    Chaplin.mediator.publish 'route', 'collect'

  weekly: ->
    @view = new WeeklyView()
    Chaplin.mediator.publish 'route', 'weekly'
