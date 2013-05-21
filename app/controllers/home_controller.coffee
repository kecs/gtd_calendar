mediator = require 'mediator'
Controller = require 'controllers/base/controller'
PriorizeView = require 'views/priorize_view'
CollectView = require 'views/collect_view'
WeeklyView = require 'views/weekly_view'
TodosCollected = require 'models/todos_collected'
TodosPriorized = require 'models/todos_priorized'


module.exports = class HomeController extends Controller
  historyURL: 'gtd'
  title: 'GTD'
  todosCollected = new TodosCollected()
  todosPriorized = new TodosPriorized()

  initialize: ->
    super
    # namespace hack for LocalStorage
    Backbone.$ = $
    todosCollected.fetch()
    todosPriorized.fetch()
    mediator.collected = todosCollected

  priorize: ->
    @view = new PriorizeView collection: todosPriorized
    mediator.publish 'route', 'priorize'

  collect: ->
    @view = new CollectView collection: todosCollected
    mediator.publish 'route', 'collect'

  weekly: ->
    @view = new WeeklyView collection: todosPriorized
    mediator.publish 'route', 'weekly'
