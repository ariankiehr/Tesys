define(["jquery", "underscore", "backbone", "extractor", "tesys", "backbone-relational", "bootstrap"], function($, _, Backbone, extractor, tesys) {
	
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

    var Issue = Backbone.RelationalModel.extend({
      idAttribute: 'issueId'
    });

    var IssueCollection = Backbone.Collection.extend({
      model: Issue
    });

    var Developer = Backbone.RelationalModel.extend({
      idAttribute: 'name',
      relations: [{
        type: Backbone.HasMany, 
        key: 'issues',
        relatedModel: Issue,
        collectionType: IssueCollection,
        reverseRelation: {
          key: 'name',
          includeInJSON: 'id'
          // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
        }
      }] 
    });

    var DeveloperCollection = Backbone.Collection.extend({
      model: Developer
    });

    var developers = new DeveloperCollection(data);

    var IssueView = Backbone.View.extend({
      events: {
        'click': 'select'
      },
      initialize: function(){
        _.bindAll(this, 'render', 'select'); 
      },
      render: function(){
        this.$el = $('<a>', {
          'href': '#'+this.model.get('issueId'), 
          'id': this.model.get('issueId'),
          'class': 'list-group-item',
        }).append(this.model.get('issueId'));
        return this; // for chainable calls, like .render().el
      },
      select: function() {
        alert("Issue: " + this.model.get('issueId')+ " clicked" );
      }
    });

    var DeveloperView = Backbone.View.extend({  
      initialize: function(){
        _.bindAll(this, 'render', 'listIssues'); 
      },
      render: function(){ 
        var element = this.$el.append(
          $('<a>', 
            { 'href': '#'+this.model.get('name'),
              'class': 'list-group-item list-group-item-success',
              'data-parent': '#MainMenu',
              'data-toggle': 'collapse',
            })
          .append(this.model.get('displayName'))
        );
        this.listIssues(element) ;
        return this; // for chainable calls, like .render().el
      },
      listIssues: function(element){ 

        //issuesPanel es el panel desplegable (collapse) donde se listaran los issues
        var issuesPanel = $('<div>', {
          'class': 'panel-collapse collapse',
          'id': this.model.get('name')
        });

        //recorro todos los issues y los muestro en el panel
        _(this.model.get('issues').models).each(function(issue){
          var issueView = new IssueView({ model: issue });
          issuesPanel.append(issueView.render().$el.prop('outerHTML'));
        });
        element.append(issuesPanel);
        return this;
      }
    });

    var DeveloperCollectionView = Backbone.View.extend({
      el: $('#developers-issues'), // el attaches to existing element
      initialize: function(developerList){

        // every function that uses 'this' as the current object should be in here
        _.bindAll(this, 'render', 'appendItem');
        this.collection = developerList;
        this.render();
      },
      render: function(){
        var self = this;
        _(this.collection.models).each(function(item){ // in case collection is not empty
          self.appendItem(item);
        }, this);
      },
      appendItem: function(item){
        var itemView = new DeveloperView({model: item});
        this.$el.append(itemView.render().el);
      }
    });

    var devListView = new DeveloperCollectionView(developers);

	};

	return { 
		'start': start 
	};
	
});