define(
  [ 'jquery', 
    'tesys',  
    'model', 
    'view', 
    'bar',
    'radar',
    'parser'
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
    //desaparece el grafico que esta en el panel inactivo. Esto se debe a 
    //que AmCharts no puede graficar sobre un tab inactivo.
    var metricsToPlot = { array:[] };
    var skillsToPlot = { array:[] };
    
    // Definicion de objetos encargados de graficar sobre la UI (plotters)
    var metricsPlotter = new bar("metricChart");
    var skillPlotter = new radar("skillChart");

    // Definicion de Modelos.
    var developers = new model.DeveloperCollection();
    var metrics = new model.MetricCollection() ;
    var skills = new model.MetricCollection() ;

    // Definicion de Vistas.
    var devListView = new view.DeveloperCollectionView(
        { collection: developers, 
          plotter: [metricsPlotter, skillPlotter],
          attrToPlot: ['metrics', 'skills']
        }
    );
    var metricsView = new view.MetricCollectionView(
          { collection: metrics, 
            el: $('#metrics'), 
            metricsToPlot: metricsToPlot,
            plotter: metricsPlotter,
            type: 'metrics'
          }
    );
    var mview = new view.MetricSelectView(
          { collection: metrics,
            el: $('#submitMetricSelect') 
          }
    );
    var skillsView = new view.MetricCollectionView(
          { collection: skills, 
            el: $('#skills'), 
            metricsToPlot: skillsToPlot,
            plotter: skillPlotter,
            type: 'skills'
    });
    var developersSelectView = new view.DeveloperSelectView(
          { collection: developers,
            el: $('#puntuado'),
            elIssues: $('#issues')
          }
    );

    // Selects para las recomendaciones
    var recomendationMetricsView = new view.MetricSelectView(
      { collection: metrics,
        el: $('#recomendationMetric') 
      }
    );

    // Extraccion de los datos desde Tesys al modelo de la UI
    tesys.getAnalysis(function(data){
      developers.reset(data);
    });
    tesys.getMetrics(function(data){
      metrics.reset(data);
    });
    tesys.getSkills(function(data){

      //adapt skills to metrics format
      var adaptedData = [];
      $.each(data, function(index, el) {
        adaptedData.push({'key': el.skillName, 'nombre': el.skillName});
      });
      skills.reset(adaptedData);
    });
    

    // On click tab for metrics then replot chart
    $('#myTab a[href="#metricPane"]').on('shown.bs.tab', function (e) {
      metricsPlotter.build(metricsToPlot.array);
      $.each(view.issuesViewsToPlot.array, function(i, item){
        item.plot();
      });
    });

    $('#myTab a[href="#skillPane"]').on('shown.bs.tab', function (e) {
      skillPlotter.build(skillsToPlot.array);
      $.each(view.issuesViewsToPlot.array, function(i, item){
        item.plot();
      });
    });


    // Punctuation Form
    // Hacer que '#puntuador' extraiga los users del Jira

    $('#submitPunctuation').click(function() {
      tesys.score(
        $('#puntuador').val(), 
        $('#puntuado').val(),
        $('#issues').val(),
        $('#puntuacion').val()
      ); 
    });

    // Complex metrics form

  $('#submitMetricBtnAddMetric').click(function() {
    // Appends metric into complex metric function
    $('#submitMetricFunction').val($('#submitMetricFunction').val() + " " + $('#submitMetricSelect').find('option:selected').val()) ;
  });

  $('#submitMetricBtnSend').click(function () { 
    $("#submitMetricSpan").empty();
    try {
      //TODO el parser no acepta asociatividad con parentesis
      var metricFormula = parser.parse($("#submitMetricFunction").val());
      tesys.storeMetric(
        $("#submitMetricName").val(), 
        $("#submitMetricDescription").val(),
        metricFormula,
        function (data) {
            markers = JSON.stringify(data);
            $("#submitMetricSpan").html(markers);
        });       
    } catch (e) {
      $("#submitMetricSpan").html(String(e));
    }
  });

  //Sonar Analysis Submit
    $('#submitAnalysisBtnSend').click(function(event) {
      tesys.storeAnalysis(
        $('#submitAnalysisUrl').val(), 
        $('#submitAnalysisUser').val(),
        $('#submitAnalysisPass').val(),
        $('#submitAnalysisRepo').val(),
        $('#submitAnalysisRev').val(),
        $('#submitAnalysisKey').val()
      ); 
    });
  };

  return { 
    'start': start 
  };
	
});