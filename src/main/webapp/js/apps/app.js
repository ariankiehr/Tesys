define(
  [ 'jquery', 
    'underscore', 
    'backbone', 
    'extractor',
    'tesys',  
    'model', 
    'view', 
    'backbone-relational', 
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    extractor, 
    tesys, 
    model, 
    view
  ) {
	
	/* Main function */
  var start = function() {
    var developers;
    var devListView;

    $.ajax({ //TODO reemplazar por un llamado ajax al controller
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/developers-issues.json",
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        developers = new model.DeveloperCollection(data);
        devListView = new view.DeveloperCollectionView(developers);
      }
    });

    var metrics ;
    var metricsView ;

    $.ajax({ //TODO reemplazar por un llamado ajax al controller
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/metrics.json",
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        metrics = new model.MetricCollection(data);
        metricsView = new view.MetricCollectionView(metrics);
      }
    });

	};

	return { 
		'start': start 
	};
	
});