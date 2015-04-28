define(
  [ 'jquery', 
    'tesys',  
    'model', 
    'view', 
    'bar',
    'radar',
    'extractor'
  ], 
  function($, 
    tesys, 
    model, 
    view,
    bar,
    radar,
    extractor
  ) {
	
	/* Main function */
  var start = function() {
    //TODO arreglar el sig bug. Cuand se elije un nuevo issue para graficar, 
    //desaparece el grafico que esta en el panel inactivo. Esto se debe a 
    //que AmCharts no puede graficar sobre un tab inactivo.
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
    tesys.getAnalysis(function(data){
      developers = new model.DeveloperCollection(data);
      devListView = new view.DeveloperCollectionView(
        { collection: developers, 
          plotter: [metricsPlotter, skillPlotter],
          attrToPlot: ['metrics', 'skills']
        }
      );
    });

    var metrics ;
    var metricsView ;
    tesys.getMetrics(function(data){
        metrics = new model.MetricCollection(data);
        metricsView = new view.MetricCollectionView(
          { collection: metrics, 
            el: $('#metrics'), 
            metricsToPlot: metricsToPlot,
            plotter: metricsPlotter,
            type: 'metrics'
          }
        );
    });


    var skills ;
    var skillsView ;
    tesys.getSkills(function(data){

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
    });
    
    // Punctuation Form

    extractor.getUsers('#puntuador');
    extractor.getUsers('#puntuado');
    first = true ;
    $('#puntuado').on('DOMNodeInserted', function() { 
      if ( first  ){ 
        // esto se ejecuta se inserta el primer elemento de #puntuado
        extractor.getIssuesByUser($('#puntuado').val(), '#issues') ;
        first = false ;
      }
    });

    // este evento queda para cambiar los issues cuando se cambia el puntuado
    $('#puntuado').on('change', function() {
        extractor.getIssuesByUser($('#puntuado').val(), '#issues') ;
    });

    $('#submitPunctuation').click(function() {
      extractor.score(
        $('#puntuador').val(), 
        $('#puntuado').val(),
        $('#issues').val(),
        $('#puntuacion').val()
      ); 
    });


  };

  return { 
    'start': start 
  };
	
});