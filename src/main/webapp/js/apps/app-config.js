define(["jquery", "extractor"], function($, extractor) {
  
  /* Main function */
  var start = function() {
    extractor.getMetrics('#metrics') ;
  };

  return { 
    'start': start 
  };
  
});