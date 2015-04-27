define(
  [ 'jquery', 
    'tesys',  
    'model', 
    'view', 
    'bar',
    'radar',
  ], 
  function($, 
    tesys, 
    model, 
    view,
    bar,
    radar
  ) {
	
	/* Main function */
  var start = function() {
    //TODO arreglar el sig bug. Cuand se elije un nuevo issue para graficar, 
    //desaparece el grafico que esta en el panel inactivo.
    var metricsToPlot = { array:[] };
    var skillsToPlot = { array:[] };
    
    var metricsPlotter = new bar(
      "metricChart", 
      {    
        "type": "serial",
        "categoryField": "skill",
        "gridAboveGraphs": true,
        "valueAxes": [{
            "gridColor":"#FFFFFF",
            "gridAlpha": 0.2,
            "dashLength": 0,
            "tickPosition":"start",
            "tickLength":20,
            "axisTitleOffset": 20,
            "min": 0,
            "max": 1,
            "minMaxMultiplier": 1,
            "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
        }]   
      }, 
      []
    );

    var skillPlotter = new radar( 
      "skillChart", 
      {    
        "type": "radar",
        "categoryField": "skill",
        "valueAxes": [{
            "axisTitleOffset": 20,
            "min": 0,
            "max": 1,
            "minMaxMultiplier": 1,
            "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
        }]   
      },
      []
    );


    var developers;
    var devListView;

    $.ajax({ //TODO reemplazar por un llamado ajax al controller
      url: "file:////home/leandro/Tesis/workspace/tesys/src/main/webapp/developers-issues.json",
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        developers = new model.DeveloperCollection(data);
        devListView = new view.DeveloperCollectionView(
          { collection: developers, 
            plotter: [metricsPlotter, skillPlotter],
            attrToPlot: ['metrics', 'skills']
          }
        );
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
        metricsView = new view.MetricCollectionView(
          { collection: metrics, 
            el: $('#metrics'), 
            metricsToPlot: metricsToPlot,
            plotter: metricsPlotter,
            type: 'metrics'
          }
        );
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
        skillsView = new view.MetricCollectionView(
          { collection: skills, 
            el: $('#skills'), 
            metricsToPlot: skillsToPlot,
            plotter: skillPlotter,
            type: 'skills'
          });
      }
    });


	};

	return { 
		'start': start 
	};
	
});