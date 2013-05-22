module.exports = (match) ->
  match '', 'home#prioritize'
  match 'prioritize', 'home#prioritize'
  match 'collect', 'home#collect'
  match 'weekly', 'home#weekly'
