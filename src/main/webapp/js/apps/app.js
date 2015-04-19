define(["jquery", "underscore", "backbone", "extractor", "tesys", "bootstrap"], function($, _, Backbone, extractor, tesys) {
	
	/* Main function */
  var start = function() {/*
		var skillPlotter ;
		var metricPlotter ;

		extractor.getUsers('#users') ;
		extractor.getSkills('#skills') ;
		extractor.getMetrics('#metrics') ;
		//Busco los issues del primer item seleccionado
		extractor.getIssuesByUser($('#users').find('option:selected').val(), '#issues') ;
	*/
    tesys.getUsers(function(data){
      console.log(JSON.stringify(data));
      $.each(data, function(i, dev){
        console.log(dev);
      })
    });

    var Developer = Backbone.Model.extend({
      defaults: {
        name: 'hello',
        issues: [
          'ISSUE-1',
          'ISSUE-2'
        ]
      }
    });

    var DeveloperList = Backbone.Collection.extend({
      model: Developer
    });



    var DeveloperView = Backbone.View.extend({
      initialize: function(){
        // every function that uses 'this' as the current object should be in here
        _.bindAll(this, 'render', 'listIssues'); 
        //this.render();
        
        //issuesE: element for insert issues
        this.issuesEl = '#'+this.model.get('name') ;

      },
      render: function(){
        
        var element =
          $('<a>', 
            { 'href': '#'+this.model.get('name'), 
              'class': 'list-group-item list-group-item-success', 
              'data-parent': '#MainMenu',
              'data-toggle': 'collapse',
            })
          .append(this.model.get('name'))
           // );
        .add(
          $(  '<div>', 
            { 'class': 'panel-collapse collapse',
              'id': this.model.get('name')
            }).append(this.listIssues()))
        ;

        this.$el.append(element);

  
        return this; // for chainable calls, like .render().el
      },
      listIssues: function(){
        var result = "" ;
        //inserto la lista de issues asociadas al developer
        $.each(this.model.get('issues'), function(index, issue){
          result+="<a href=#"+issue+" class=list-group-item>"+issue+"</a>";
        });
        return $(result);
      }
    });

    var DeveloperListView = Backbone.View.extend({
      el: $('#developers-issues'), // el attaches to existing element
      initialize: function(developerList){
        // every function that uses 'this' as the current object should be in here
        _.bindAll(this, 'render');
        this.collection = developerList;
        this.counter = 0;
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

        $(this.el).append(itemView.render().el);
        
      }
    });
    
    var developer = new Developer();
    var dev1 = new Developer({
        name: 'pepe',
        issues: [
          'ISSUE-1',
          'asdasd-2'
        ]
      });
    var dev2 = new Developer({
        name: 'heladsdsalo',
        issues: [
          'ISSUdwadwaE-1',
          'ISSUE-2'
        ]
      });
    var dev3 = new Developer({
        name: 'heldwadwalo',
        issues: [
          'ISSUdwadwaE-1',
          'ISSUE-2'
        ]
      });

    var developerList = new DeveloperList([developer, dev1, dev2, dev3]);


    var developerView = new DeveloperView({
      model: developer
    });
    
    var devListView = new DeveloperListView(developerList);


	};

	return { 
		'start': start 
	};
	
});