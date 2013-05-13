Model = require 'models/base/model'

module.exports = class Menu extends Model
  defaults:
    items: [
      {href: 'collect', title: 'Collect'},
      {href: 'priorize', title: 'Priorize'},
      {href: 'weekly', title: 'Weekly'},
    ]

