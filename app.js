(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  var Application, Chaplin, Layout, MenuController, mediator, routes, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  MenuController = require('controllers/menu_controller');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.title = 'calendar';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher();
      this.initLayout();
      this.initControllers();
      this.initRouter(routes);
      this.initMediator();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      return new MenuController();
    };

    Application.prototype.initMediator = function() {
      mediator.router = this.router;
      return mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
});
window.require.register("controllers/base/controller", function(exports, require, module) {
  var Chaplin, Controller, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {
    __extends(Controller, _super);

    function Controller() {
      _ref = Controller.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Controller;

  })(Chaplin.Controller);
  
});
window.require.register("controllers/home_controller", function(exports, require, module) {
  var CollectView, Controller, HomeController, PrioritizeView, TodosCollected, TodosPrioritized, WeeklyView, mediator, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Controller = require('controllers/base/controller');

  PrioritizeView = require('views/prioritize_view');

  CollectView = require('views/collect_view');

  WeeklyView = require('views/weekly_view');

  TodosCollected = require('models/todos_collected');

  TodosPrioritized = require('models/todos_prioritized');

  module.exports = HomeController = (function(_super) {
    var todosCollected, todosPrioritized;

    __extends(HomeController, _super);

    function HomeController() {
      _ref = HomeController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HomeController.prototype.historyURL = 'gtd';

    HomeController.prototype.title = 'GTD';

    todosCollected = new TodosCollected();

    todosPrioritized = new TodosPrioritized();

    HomeController.prototype.initialize = function() {
      HomeController.__super__.initialize.apply(this, arguments);
      Backbone.$ = $;
      todosCollected.fetch();
      todosPrioritized.fetch();
      return mediator.collected = todosCollected;
    };

    HomeController.prototype.prioritize = function() {
      this.view = new PrioritizeView({
        collection: todosPrioritized
      });
      return mediator.publish('route', 'prioritize');
    };

    HomeController.prototype.collect = function() {
      this.view = new CollectView({
        collection: todosCollected
      });
      return mediator.publish('route', 'collect');
    };

    HomeController.prototype.weekly = function() {
      this.view = new WeeklyView({
        collection: todosPrioritized
      });
      return mediator.publish('route', 'weekly');
    };

    return HomeController;

  })(Controller);
  
});
window.require.register("controllers/menu_controller", function(exports, require, module) {
  var Controller, Menu, MenuController, MenuView, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  Menu = require('models/menu');

  MenuView = require('views/menu_view');

  module.exports = MenuController = (function(_super) {
    __extends(MenuController, _super);

    function MenuController() {
      _ref = MenuController.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MenuController.prototype.initialize = function() {
      MenuController.__super__.initialize.apply(this, arguments);
      this.model = new Menu();
      return this.view = new MenuView({
        model: this.model
      });
    };

    return MenuController;

  })(Controller);
  
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = require('application');

  $(document).on('ready', function() {
    var app;

    app = new Application();
    return app.initialize();
  });
  
});
window.require.register("lib/services/service_provider", function(exports, require, module) {
  var Chaplin, ServiceProvider, utils;

  utils = require('lib/utils');

  Chaplin = require('chaplin');

  module.exports = ServiceProvider = (function() {
    _(ServiceProvider.prototype).extend(Chaplin.EventBroker);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.load
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*

    Standard methods and their signatures:

    load: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

    loadHandler: =>
      # Init the library, then resolve
      ServiceProviderLibrary.init(foo: 'bar')
      @resolve()

    isLoaded: ->
      # Return a Boolean
      Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, loginContext)
      ServiceProviderLibrary.login callback

    # Callback for the login popup
    loginHandler: (loginContext, response) =>

      eventPayload = {provider: this, loginContext}
      if response
        # Publish successful login
        @publishEvent 'loginSuccessful', eventPayload

        # Publish the session
        @publishEvent 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.

      else
        @publishEvent 'loginFail', eventPayload

    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      ServiceProviderLibrary.getLoginStatus callback, force

    loginStatusHandler: (response) =>
      return unless response
      @publishEvent 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

  
});
window.require.register("lib/support", function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
});
window.require.register("lib/utils", function(exports, require, module) {
  var Chaplin, utils,
    __hasProp = {}.hasOwnProperty;

  Chaplin = require('chaplin');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    /*
    Wrap methods so they can be called before a deferred is resolved.
    The actual methods are called once the deferred is resolved.
    
    Parameters:
    
    Expects an options hash with the following properties:
    
    deferred
      The Deferred object to wait for.
    
    methods
      Either:
      - A string with a method name e.g. 'method'
      - An array of strings e.g. ['method1', 'method2']
      - An object with methods e.g. {method: -> alert('resolved!')}
    
    host (optional)
      If you pass an array of strings in the `methods` parameter the methods
      are fetched from this object. Defaults to `deferred`.
    
    target (optional)
      The target object the new wrapper methods are created at.
      Defaults to host if host is given, otherwise it defaults to deferred.
    
    onDeferral (optional)
      An additional callback function which is invoked when the method is called
      and the Deferred isn't resolved yet.
      After the method is registered as a done handler on the Deferred,
      this callback is invoked. This can be used to trigger the resolving
      of the Deferred.
    
    Examples:
    
    deferMethods(deferred: def, methods: 'foo')
      Wrap the method named foo of the given deferred def and
      postpone all calls until the deferred is resolved.
    
    deferMethods(deferred: def, methods: def.specialMethods)
      Read all methods from the hash def.specialMethods and
      create wrapped methods with the same names at def.
    
    deferMethods(
      deferred: def, methods: def.specialMethods, target: def.specialMethods
    )
      Read all methods from the object def.specialMethods and
      create wrapped methods at def.specialMethods,
      overwriting the existing ones.
    
    deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
      Wrap the methods obj.foo and obj.bar so all calls to them are postponed
      until def is resolved. obj.foo and obj.bar are overwritten
      with their wrappers.
    */

    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;

      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') {
          continue;
        }
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) {
        context = deferred;
      }
      return function() {
        var args;

        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') {
            return onDeferral.apply(context);
          }
        }
      };
    }
  });

  module.exports = utils;
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;

    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context, _ref;

    context = ((_ref = mediator.user) != null ? _ref.serialize() : void 0) || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });
  
});
window.require.register("mediator", function(exports, require, module) {
  module.exports = require('chaplin').mediator;
  
});
window.require.register("models/base/collection", function(exports, require, module) {
  var Chaplin, Collection, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  Model = require('models/base/model');

  module.exports = Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection() {
      _ref = Collection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Collection.prototype.model = Model;

    return Collection;

  })(Chaplin.Collection);
  
});
window.require.register("models/base/model", function(exports, require, module) {
  var Chaplin, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {
    __extends(Model, _super);

    function Model() {
      _ref = Model.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Model;

  })(Chaplin.Model);
  
});
window.require.register("models/menu", function(exports, require, module) {
  var Menu, Model, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Menu = (function(_super) {
    __extends(Menu, _super);

    function Menu() {
      _ref = Menu.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Menu.prototype.defaults = {
      items: [
        {
          href: 'collect',
          title: 'Collect'
        }, {
          href: 'prioritize',
          title: 'Prioritize'
        }, {
          href: 'weekly',
          title: 'Weekly'
        }
      ]
    };

    return Menu;

  })(Model);
  
});
window.require.register("models/todo_collected", function(exports, require, module) {
  var Model, TodoCollected, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = TodoCollected = (function(_super) {
    __extends(TodoCollected, _super);

    function TodoCollected() {
      _ref = TodoCollected.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TodoCollected.prototype.validate = function() {
      var msg;

      msg = null;
      if (!this.title) {
        msg = 'Supply title!';
      }
      if (msg != null) {
        if (typeof console !== "undefined" && console !== null) {
          console.log(msg);
        }
      }
      return msg;
    };

    return TodoCollected;

  })(Model);
  
});
window.require.register("models/todo_prioritized", function(exports, require, module) {
  var TodoCollected, TodoPrioritized, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TodoCollected = require('models/todo_collected');

  module.exports = TodoPrioritized = (function(_super) {
    __extends(TodoPrioritized, _super);

    function TodoPrioritized() {
      _ref = TodoPrioritized.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TodoPrioritized.prototype.firstSteps = null;

    return TodoPrioritized;

  })(TodoCollected);
  
});
window.require.register("models/todos_collected", function(exports, require, module) {
  var Collection, TodoCollected, TodosCollected, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  TodoCollected = require('models/todo_collected');

  module.exports = TodosCollected = (function(_super) {
    __extends(TodosCollected, _super);

    function TodosCollected() {
      _ref = TodosCollected.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TodosCollected.model = TodoCollected;

    TodosCollected.prototype.localStorage = new Backbone.LocalStorage('gtd-todos-collected');

    return TodosCollected;

  })(Collection);
  
});
window.require.register("models/todos_prioritized", function(exports, require, module) {
  var Collection, TodoPrioritized, TodosPrioritized, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TodoPrioritized = require('models/todo_prioritized');

  Collection = require('models/base/collection');

  module.exports = TodosPrioritized = (function(_super) {
    __extends(TodosPrioritized, _super);

    function TodosPrioritized() {
      _ref = TodosPrioritized.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TodosPrioritized.model = TodoPrioritized;

    TodosPrioritized.prototype.comparator = function(model) {
      return model.get('order');
    };

    TodosPrioritized.prototype.localStorage = new Backbone.LocalStorage('gtd-todos-prioritized');

    TodosPrioritized.prototype.destroy = function(model) {
      this.remove(model);
      this.localStorage.destroy(model);
      return model;
    };

    return TodosPrioritized;

  })(Collection);
  
});
window.require.register("routes", function(exports, require, module) {
  module.exports = function(match) {
    match('/gtd_calendar', 'home#prioritize');
    match('/gtd_calendar/', 'home#prioritize');
    match('gtd_calendar/', 'home#prioritize');
    match('gtd_calendar/prioritize', 'home#prioritize');
    match('gtd_calendar/collect', 'home#collect');
    return match('gtd_calendar/weekly', 'home#weekly');
  };
  
});
window.require.register("views/base/collection_view", function(exports, require, module) {
  var Chaplin, CollectionView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {
    __extends(CollectionView, _super);

    function CollectionView() {
      _ref = CollectionView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
});
window.require.register("views/base/page_view", function(exports, require, module) {
  var PageView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  module.exports = PageView = (function(_super) {
    __extends(PageView, _super);

    function PageView() {
      _ref = PageView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PageView.prototype.container = '#page-container';

    PageView.prototype.autoRender = true;

    PageView.prototype.renderedSubviews = false;

    PageView.prototype.initialize = function() {
      var rendered,
        _this = this;

      PageView.__super__.initialize.apply(this, arguments);
      if (this.model || this.collection) {
        rendered = false;
        return this.modelBind('change', function() {
          if (!rendered) {
            _this.render();
          }
          return rendered = true;
        });
      }
    };

    PageView.prototype.renderSubviews = function() {};

    PageView.prototype.render = function() {
      PageView.__super__.render.apply(this, arguments);
      if (!this.renderedSubviews) {
        this.renderSubviews();
        return this.renderedSubviews = true;
      }
    };

    return PageView;

  })(View);
  
});
window.require.register("views/base/view", function(exports, require, module) {
  var Chaplin, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view_helper');

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
});
window.require.register("views/collect_view", function(exports, require, module) {
  var CollectView, View, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/collect');

  View = require('views/base/view');

  module.exports = CollectView = (function(_super) {
    __extends(CollectView, _super);

    function CollectView() {
      _ref = CollectView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    CollectView.prototype.template = template;

    CollectView.prototype.container = '#todo-list';

    CollectView.prototype.autoRender = true;

    CollectView.prototype.initialize = function() {
      var _this = this;

      CollectView.__super__.initialize.apply(this, arguments);
      this.delegate('focus', 'input', this.focus);
      this.delegate('blur', 'input', this.addTodo);
      return this.on('addedToDOM', function() {
        return (_this.$el.find('input')).focus();
      });
    };

    CollectView.prototype.focus = function(event) {
      var unbind,
        _this = this;

      unbind = function(e) {
        if (e.which === 13) {
          return _this.$(event.target).off('keyup').trigger('blur');
        }
      };
      return this.$(event.target).on('keyup', unbind);
    };

    CollectView.prototype.addTodo = function() {
      var title;

      title = (this.$el.find('input')).val();
      if (title && !(this.collection.where({
        title: title
      })).length) {
        this.collection.create({
          title: title
        });
        return this.render();
      }
    };

    return CollectView;

  })(View);
  
});
window.require.register("views/detail", function(exports, require, module) {
  var DetailView, View, clear, template, __, _ref,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  View = require('views/base/view');

  template = require('views/templates/detail');

  __ = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, ['[*] '].concat(__slice.call(args)));
  };

  clear = function(text) {
    return (/\w+.*\w+/gi.exec(text))[0];
  };

  module.exports = DetailView = (function(_super) {
    __extends(DetailView, _super);

    function DetailView() {
      this.removeStep = __bind(this.removeStep, this);
      this.setDueDate = __bind(this.setDueDate, this);
      this.getDueDate = __bind(this.getDueDate, this);
      this.done = __bind(this.done, this);
      this.remove = __bind(this.remove, this);
      this.addFirstStep = __bind(this.addFirstStep, this);    _ref = DetailView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    DetailView.prototype.template = template;

    DetailView.prototype.container = '#todo-detail';

    DetailView.prototype.autoRender = true;

    DetailView.prototype.initialize = function(options) {
      var _this = this;

      DetailView.__super__.initialize.apply(this, arguments);
      this.parentView = options.parentView;
      this.parentView.disallowEdit();
      this.delegate('focus', 'input', this.focus);
      this.delegate('blur', 'input', this.addFirstStep);
      this.delegate('click', 'li i.icon-remove', this.removeStep);
      this.on('addedToDOM', function() {
        (_this.$el.find('input')).focus();
        (_this.$el.find('#remove')).click(_this.remove);
        (_this.$el.find('i.icon-ok')).click(_this.done);
        (_this.$el.find('#due-date')).css('cursor', 'pointer').click(_this.setDueDate);
        return (_this.$el.find('li')).hover(function(e) {
          return _this.$(e.target).append('<i class="icon-remove"></i>');
        }, function(e) {
          return _this.$(e.target).find('i.icon-remove').remove();
        });
      });
      return Handlebars.registerHelper('getDueDate', this.getDueDate);
    };

    DetailView.prototype.focus = function(event) {
      var unbind,
        _this = this;

      unbind = function(e) {
        if (e.which === 13) {
          return _this.$(event.target).off('keyup').trigger('blur');
        }
      };
      return this.$(event.target).on('keyup', unbind);
    };

    DetailView.prototype.addFirstStep = function(e) {
      var firstSteps, step;

      step = this.$(e.target).val();
      firstSteps = (this.model.get('firstSteps')) || [];
      if (!step || __indexOf.call(firstSteps, step) >= 0) {
        return;
      }
      firstSteps.push(step);
      this.model.save({
        firstSteps: firstSteps
      });
      return this.render();
    };

    DetailView.prototype.remove = function() {
      if (confirm('Really want to remove?')) {
        $("#todo-list li:contains('" + (this.model.get('title')) + "')").remove();
        this.parentView.collection.destroy(this.model);
        return this.dispose();
      }
    };

    DetailView.prototype.done = function() {
      var steps;

      steps = this.model.get('firstSteps');
      if (!(steps && steps.length)) {
        return alert('You must specify first steps!');
      } else if (!this.model.get('dueDate')) {
        return alert('You must set due date!');
      } else {
        this.model.save({
          moved: true
        });
        this.parentView.allowEdit();
        $("#todo-list li:contains('" + (this.model.get('title')) + "')").css('color', 'black').trigger('mouseout');
        return this.dispose();
      }
    };

    DetailView.prototype.getDueDate = function() {
      return $.datepicker.formatDate('d MM yy', new Date(this.model.get('dueDate')));
    };

    DetailView.prototype.setDueDate = function() {
      var $datepicker,
        _this = this;

      $datepicker = $('#datepicker');
      $datepicker.datepicker({
        onSelect: function(date) {
          var dueDate;

          dueDate = $.datepicker.parseDate('mm/dd/yy', date).getTime();
          _this.model.save({
            dueDate: dueDate
          });
          return $datepicker.slideUp('slow', _this.render);
        }
      });
      $('a.ui-datepicker-next').append('<i class="icon-arrow-right"></i>');
      return $('a.ui-datepicker-prev').append('<i class="icon-arrow-left"></i>');
    };

    DetailView.prototype.removeStep = function(e) {
      var step;

      step = clear((this.$(e.target)).parent('li').detach().text());
      return this.model.save({
        firstSteps: _.without(this.model.get('firstSteps'), step)
      });
    };

    return DetailView;

  })(View);
  
});
window.require.register("views/layout", function(exports, require, module) {
  var Chaplin, Layout, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {
    __extends(Layout, _super);

    function Layout() {
      _ref = Layout.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Layout;

  })(Chaplin.Layout);
  
});
window.require.register("views/menu_view", function(exports, require, module) {
  var MenuView, View, mediator, template, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/menu');

  mediator = require('mediator');

  module.exports = MenuView = (function(_super) {
    __extends(MenuView, _super);

    function MenuView() {
      _ref = MenuView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MenuView.prototype.template = template;

    MenuView.prototype.tagName = 'ul';

    MenuView.prototype.className = 'nav';

    MenuView.prototype.container = '#navbar';

    MenuView.prototype.autoRender = true;

    MenuView.prototype.initialize = function() {
      var _this = this;

      MenuView.__super__.initialize.apply(this, arguments);
      mediator.subscribe('route', function(href) {
        return _this.activate(href);
      });
      return this.delegate('click', 'a:not([class="brand"])', this.navigate);
    };

    MenuView.prototype.navigate = function(e) {
      var err, href;

      e.preventDefault();
      e.stopPropagation();
      try {
        href = (e.target.getAttribute('href')).split('/')[1];
        return mediator.router.route(href);
      } catch (_error) {
        err = _error;
        return typeof console !== "undefined" && console !== null ? console.log(err) : void 0;
      }
    };

    MenuView.prototype.activate = function(href) {
      return ((this.$el.find("a[href=\"/" + href + "\"]")).parent().addClass('active')).siblings().removeClass('active');
    };

    return MenuView;

  })(View);
  
});
window.require.register("views/prioritize_view", function(exports, require, module) {
  var DetailView, PrioritizeView, View, clear, mediator, template, __, _ref,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/prioritize');

  View = require('views/base/view');

  mediator = require('mediator');

  DetailView = require('views/detail');

  __ = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, ['[*] '].concat(__slice.call(args)));
  };

  clear = function(text) {
    return (/\w+.*\w+/gi.exec(text))[0];
  };

  module.exports = PrioritizeView = (function(_super) {
    __extends(PrioritizeView, _super);

    function PrioritizeView() {
      this.detail = __bind(this.detail, this);
      this.reorder = __bind(this.reorder, this);    _ref = PrioritizeView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PrioritizeView.prototype.template = template;

    PrioritizeView.prototype.container = '#todo-list';

    PrioritizeView.prototype.className = 'prioritize';

    PrioritizeView.prototype.autoRender = true;

    PrioritizeView.prototype.initialize = function() {
      var max,
        _this = this;

      PrioritizeView.__super__.initialize.apply(this, arguments);
      max = (max = (_.max(this.collection.pluck('order'))) > 0) ? max : 0;
      mediator.collected.each(function(todo, i) {
        var title;

        title = todo.get('title');
        if (!(_this.collection.where({
          title: title
        })).length) {
          return _this.collection.create({
            title: title,
            dueDate: Date.now(),
            order: max + i + 1,
            moved: false
          });
        }
      });
      mediator.collected.each(function(todo) {
        return todo.destroy();
      });
      this.collection.reset(this.collection.filter(function(todo) {
        var dueDate, tomorrow;

        dueDate = new Date(todo.get('dueDate'));
        tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24);
        return dueDate < tomorrow;
      }));
      return this.on('addedToDOM', function() {
        return (_this.$el.find('ul')).slideDown().css('user-select', 'none');
      });
    };

    PrioritizeView.prototype.reorder = function(e, ui) {
      var _this = this;

      (this.$el.find('li')).each(function(i, el) {
        var text, title, todo;

        text = (_this.$(el)).text();
        title = clear(text);
        todo = (_this.collection.where({
          title: title
        }))[0];
        if (ui.item.text() === text) {
          return todo.save({
            order: i,
            moved: true
          });
        } else {
          return todo.save({
            order: i
          });
        }
      });
      return ui.item.css({
        color: 'black'
      });
    };

    PrioritizeView.prototype.render = function(e, ui) {
      PrioritizeView.__super__.render.apply(this, arguments);
      (this.$el.find('ul')).sortable({
        cursor: 'move',
        axis: 'y',
        update: this.reorder,
        disabled: false
      });
      return this.allowEdit();
    };

    PrioritizeView.prototype.detail = function(e) {
      var model, title;

      e.stopPropagation();
      title = clear(this.$(e.target).parent('li').text());
      model = this.collection.where({
        title: title
      })[0];
      return this.subview('detail', new DetailView({
        model: model,
        parentView: this
      }));
    };

    PrioritizeView.prototype.allowEdit = function() {
      var _this = this;

      return (this.$el.find('ul')).sortable('option', 'disabled', false).find('li').hover(function(e) {
        return (_this.$(e.target)).css('backgroundColor', 'AliceBlue').find('i').show();
      }, function(e) {
        return (_this.$(e.target)).css('backgroundColor', 'white').find('i').hide();
      }).stop().find('i').click(this.detail);
    };

    PrioritizeView.prototype.disallowEdit = function() {
      return (this.$el.find('ul')).sortable('option', 'disabled', true).find('li').off('mouseenter mouseleave');
    };

    return PrioritizeView;

  })(View);
  
});
window.require.register("views/templates/collect", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = "", stack1, foundHelper;
    buffer += "\n  <li>";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "</li>\n  ";
    return buffer;}

    buffer += "<ul>\n  ";
    stack1 = depth0.items;
    stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</ul>\n\n<input type=\"text\" id=\"new-todo\" placeholder=\"New todo\" />\n \n";
    return buffer;});
});
window.require.register("views/templates/detail", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n  <ol>\n  ";
    stack1 = depth0.firstSteps;
    stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(2, program2, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  </ol>\n";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "";
    buffer += "\n    <li>";
    depth0 = typeof depth0 === functionType ? depth0() : depth0;
    buffer += escapeExpression(depth0) + "</li>\n  ";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n  <div class=\"alert\">\n  You must specify first steps!\n  </div>\n";}

    buffer += "<h2>";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "\n  <i id=\"remove\" class=\"icon-remove pull-right\" title=\"Completed\"></i>\n  <i class=\"icon-ok pull-right\" title=\"Finish editing\"></i>\n</h2>\n<h5 id=\"due-date\">(";
    foundHelper = helpers.getDueDate;
    stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "getDueDate", depth0, {hash:{}});
    buffer += escapeExpression(stack1) + ")</h5>\n<div id=\"datepicker\"></div><br />\n\n";
    stack1 = depth0.firstSteps;
    stack1 = helpers['if'].call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n<input type=\"text\" placeholder=\"Step\" />";
    return buffer;});
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    


    return "<a href=\"http://brunch.io/\">\n  <img src=\"http://brunch.io/images/brunch.png\" alt=\"Brunch\" />\n</a>\n";});
});
window.require.register("views/templates/menu", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = "", stack1, foundHelper;
    buffer += "\n  <li><a href=\"/";
    foundHelper = helpers.href;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.href; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "</a></li>\n";
    return buffer;}

    stack1 = depth0.items;
    stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { return stack1; }
    else { return ''; }});
});
window.require.register("views/templates/prioritize", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, foundHelper;
    buffer += "\n    ";
    stack1 = depth0.moved;
    stack1 = helpers.unless.call(depth0, stack1, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    ";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + "\n    <i class=\"icon-eye-open\" style=\"display:none\"></i>\n    </li>\n  ";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n    <li style=\"color:red\">\n    ";}

  function program4(depth0,data) {
    
    
    return "\n    <li>\n    ";}

    buffer += "<ul style=\"display:none\">\n  ";
    stack1 = depth0.items;
    stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</ul>\n";
    return buffer;});
});
window.require.register("views/templates/weekly", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = "", stack1, foundHelper;
    buffer += "\n  <li>";
    foundHelper = helpers.title;
    if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
    else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
    buffer += escapeExpression(stack1) + " <span class=\"pull-right\">(";
    foundHelper = helpers.getDueDate;
    stack1 = foundHelper ? foundHelper.call(depth0, depth0, {hash:{}}) : helperMissing.call(depth0, "getDueDate", depth0, {hash:{}});
    buffer += escapeExpression(stack1) + ")</span>\n  <i class=\"icon-eye-open\" style=\"display:none\"></i></li>\n";
    return buffer;}

    buffer += "<ul>\n";
    stack1 = depth0.items;
    stack1 = helpers.each.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "  \n</ul>\n";
    return buffer;});
});
window.require.register("views/weekly_view", function(exports, require, module) {
  var DetailView, View, WeeklyView, clear, mediator, template, __, _ref,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/weekly');

  View = require('views/base/view');

  mediator = require('mediator');

  DetailView = require('views/detail');

  __ = function() {
    var args;

    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log.apply(console, ['[*] '].concat(__slice.call(args)));
  };

  clear = function(text) {
    return (/(\w+.*\w+)\s\(/gi.exec(text))[1];
  };

  module.exports = WeeklyView = (function(_super) {
    __extends(WeeklyView, _super);

    function WeeklyView() {
      this.detail = __bind(this.detail, this);    _ref = WeeklyView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    WeeklyView.prototype.template = template;

    WeeklyView.prototype.container = '#todo-list';

    WeeklyView.prototype.autoRender = true;

    WeeklyView.prototype.initialize = function() {
      var _this = this;

      WeeklyView.__super__.initialize.apply(this, arguments);
      this.collection.__proto__.comparator = function(todo) {
        return todo.get('dueDate');
      };
      this.collection.sort();
      Handlebars.registerHelper('getDueDate', this.getDueDate);
      return this.on('addedToDOM', function() {
        return (_this.$el.find('ul')).slideDown().css('user-select', 'none');
      });
    };

    WeeklyView.prototype.render = function() {
      WeeklyView.__super__.render.apply(this, arguments);
      return this.allowEdit();
    };

    WeeklyView.prototype.allowEdit = function() {
      var _this = this;

      return (this.$el.find('ul')).find('li').hover(function(e) {
        return (_this.$(e.target)).css('backgroundColor', 'AliceBlue').find('i').show();
      }, function(e) {
        return (_this.$(e.target)).css('backgroundColor', 'white').find('i').hide();
      }).stop().find('i').click(this.detail);
    };

    WeeklyView.prototype.detail = function(e) {
      var model, title;

      title = clear(this.$(e.target).parent('li').text());
      model = this.collection.where({
        title: title
      })[0];
      return this.subview('detail', new DetailView({
        model: model,
        parentView: this
      }));
    };

    WeeklyView.prototype.disallowEdit = function() {
      return (this.$el.find('ul')).find('li').off('mouseenter mouseleave');
    };

    WeeklyView.prototype.getDueDate = function(todo) {
      return $.datepicker.formatDate('d MM yy', new Date(todo.dueDate));
    };

    return WeeklyView;

  })(View);
  
});
