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
        metricsView = new view.MetricCollectionView({collection: metrics, el: $('#metrics')});
      }
    });

    var skills ;
    var skillsView ;

    $.ajax({ //TODO reemplazar por un llamado ajax al controller
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/skills.json",
      type: 'GET',
      dataType: 'json',
      success: function(data) {

        //adapt skills to metrics format
        var adaptedData = [];
        $.each(data, function(index, el) {
          adaptedData.push({'key': el.skillName, 'nombre': el.skillName});
        });

        skills = new model.MetricCollection(adaptedData);
        skillsView = new view.MetricCollectionView({collection: skills, el: $('#skills')});
      }
    });


	};

	return { 
		'start': start 
	};
	
});