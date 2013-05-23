exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  files:
    javascripts:
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
        'test/javascripts/test.js': /^test[\\/](?!vendor)/
        'test/javascripts/test-vendor.js': /^test[\\/](?=vendor)/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: [
          'vendor/scripts/console-helper.js'
          'vendor/scripts/jquery-1.9.1.js'
          'vendor/scripts/underscore-1.4.0.js'
          'vendor/scripts/backbone-0.9.2.js'
          'vendor/scripts/jquery-ui-1.10.3.custom.min.js'
          'vendor/scripts/backbone.localStorage.js'
        ]

    stylesheets:
      defaultExtension: 'scss'
      joinTo:
        'stylesheets/app.css': /^(app|vendor)/
        'test/stylesheets/test.css': /^test/
      order:
        before: ['vendor/styles/normalize-1.0.1.css']
        after: ['vendor/styles/helpers.css']

    templates:
      joinTo: 'javascripts/app.js'