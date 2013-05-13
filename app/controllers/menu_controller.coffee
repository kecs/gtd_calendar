Controller = require 'controllers/base/controller'
Menu = require 'models/menu'
MenuView = require 'views/menu_view'

module.exports = class MenuController extends Controller
  initialize: ->
    super
    @model = new Menu()
    @view = new MenuView({@model})
