function displayOptions(result, htmlOptionsId) {
	$.each(result, function() {
    	$(htmlOptionsId).append( new Option(this,this) );
	});
}


var skillsToPlot = [] ;
var metricsToPlot = [] ;



//htmlItemSource: combobox
//htmlItemContainer: textarea
function addItem(htmlItemSource, htmlItemContainer, itemArray) {
    var item = $(htmlItemSource).find('option:selected').val() ;
    if ( $.inArray(item, itemArray) == -1 ) {
    	itemArray.push(item) ;
		$(htmlItemContainer).append(item+ "\n") ;    
	}     
	return false;	
}

$('#btnAddSkill').click(function() {
	addItem('#skills', '#skillContainer', skillsToPlot) ;
});


$('#btnAddMetric').click(function() {
	addItem('#metrics', '#metricContainer', metricsToPlot) ;
});

$('#btnGetIssues').click(function() { 
	$('#issues').empty() ;
	getIssuesByUser($('#users').find('option:selected').val(), '#issues') ;
});

$('#users').change(function() { 
	$('#issues').empty() ;
	getIssuesByUser($('#users').find('option:selected').val(), '#issues') ;
});

$('#users').focus(function() { 
	$('#issues').empty() ;
	getIssuesByUser($('#users').find('option:selected').val(), '#issues') ;
});

$('#btnPlot').click(function() {
	var issueKey = $('#issues').find('option:selected').val() ;
	var userKey = $('#users').find('option:selected').val() ;	
	if (issueKey) {
		if (metricPlotter == null) {
			var chart = AmCharts.makeChart("barChartDiv", {    
			    "type": "serial",
			    "categoryField": "skill",
			    "gridAboveGraphs": true,
			    "valueAxes": [{
			        "gridColor":"#FFFFFF",
			        "gridAlpha": 0.2,
			        "dashLength": 0
			    }],
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
			});
			metricPlotter = new BarChartPlotter(chart, metricsToPlot) ;
		}
		plotIssueMetrics(issueKey, userKey, metricPlotter) ;
		$('#btnAddMetric').prop('disabled', true);
	} else {
		alert("Seleccione un Issue") ;
	}
});

$('#btnPlotSkills').click(function() {
	var issueKey = $('#issues').find('option:selected').val() ;
	var userKey = $('#users').find('option:selected').val() ;

	if (issueKey) {
		if (skillPlotter == null) {
			var chart = AmCharts.makeChart("chartdiv", {    
			    "type": "radar",
			    "categoryField": "skill",
			    "valueAxes": [{
			        "axisTitleOffset": 20,
			        "min": 0,
			        "max": 1,
			        "minMaxMultiplier": 1,
			        "axisAlpha": 0.15 //hace mas clara u oscura la linea de los ejes
			    }]   

			});
			skillPlotter = new RadarChartPlotter(chart, skillsToPlot) ;
		}
		plotIssueSkills(issueKey, userKey, skillPlotter) ;
		$('#btnAddSkill').prop('disabled', true);
	} else {
		alert("Seleccione un Issue") ;
	}

});

