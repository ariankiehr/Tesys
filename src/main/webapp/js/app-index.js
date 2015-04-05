define(["jquery", "extractor"], function($, extractor) {
	
	/* Main function */
  var start = function() {
		var skillPlotter ;
		var metricPlotter ;

		extractor.getUsers('#users') ;
		extractor.getSkills('#skills') ;
		extractor.getMetrics('#metrics') ;
		//Busco los issues del primer item seleccionado
		extractor.getIssuesByUser($('#users').find('option:selected').val(), '#issues') ;
	};

	return { 
		'start': start 
	};
	
});