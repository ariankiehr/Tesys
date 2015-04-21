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
    var data = [
      { 'displayName': 'Leandro Lezcano',
        'name': 'llezcano',
        issues: [
          { 'issueId': 'POL-22' }, 
          { 'issueId': 'POL-44' }
        ]
      }, 
      { 'displayName': 'Ezequiel Trapani',
        'name': 'etrapani',
        issues: [
          { 'issueId': 'MON-56' }, 
          { 'issueId': 'MON-84' }
        ]
      }
    ];

    var developers = new model.DeveloperCollection(data);
    var devListView = new view.DeveloperCollectionView(developers);
	};

	return { 
		'start': start 
	};
	
});