requirejs(["common"], function (common) { 
  requirejs(["app.config", "handlers.config"], function(App) {
    App.start() ;
  });
});
