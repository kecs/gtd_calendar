Model = require 'models/base/model'

module.exports = class Menu extends Model
  defaults:
    items: [
      {href: 'collect', title: 'Collect'},
      {href: 'prioritize', title: 'Prioritize'},
      {href: 'weekly', title: 'Weekly'},
    ]

