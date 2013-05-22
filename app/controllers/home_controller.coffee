mediator = require 'mediator'
Controller = require 'controllers/base/controller'
PrioritizeView = require 'views/prioritize_view'
CollectView = require 'views/collect_view'
WeeklyView = require 'views/weekly_view'
TodosCollected = require 'models/todos_collected'
TodosPrioritized = require 'models/todos_prioritized'


module.exports = class HomeController extends Controller
  historyURL: 'gtd'
  title: 'GTD'
  todosCollected = new TodosCollected()
  todosPrioritized = new TodosPrioritized()

  initialize: ->
    super
    # namespace hack for LocalStorage
    Backbone.$ = $
    todosCollected.fetch()
    todosPrioritized.fetch()
    mediator.collected = todosCollected

  prioritize: ->
    @view = new PrioritizeView collection: todosPrioritized
    mediator.publish 'route', 'prioritize'

  collect: ->
    @view = new CollectView collection: todosCollected
    mediator.publish 'route', 'collect'

  weekly: ->
    @view = new WeeklyView collection: todosPrioritized
    mediator.publish 'route', 'weekly'
