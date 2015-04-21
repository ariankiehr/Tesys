define(
  [ 'jquery', 
    'underscore', 
    'backbone',
    'extractor',
    'tesys',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    extractor, 
    tesys 
  ) {
  
  var IssueView = Backbone.View.extend({
    tagName: 'a',

    //constants definitions 
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon", 
    //end constants definitions
    
    events: {
      'click': 'select'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'select'); 
      this.isSelected = false;
      this.render();
    },
    render: function(){
      var issueId = this.model.get('issueId');
      this.el.id = issueId; //= "<a id='"+issueId+"' href='#"+issueId+"' class='list-group-item'>"+issueId+"</a>" ;
      this.el.setAttribute('class', 'list-group-item');
      this.el.text = issueId ;
      return this; // for chainable calls, like .render().el
    },
    select: function() {
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ; 
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
      }
    }
  });

  var DeveloperView = Backbone.View.extend({ 
    events: {
      'click': 'select'
    } ,
    initialize: function(){
      _.bindAll(this, 'render', 'listIssues', 'select'); 
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
          issuesPanel.append(issueView.render().el);
      });
      element.append(issuesPanel);
      return this;
    },
    select: function() {
      console.log("clicked developer: " + this.model.get('name'));
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



  return {
    IssueView: IssueView,
    DeveloperView: DeveloperView,
    DeveloperCollectionView: DeveloperCollectionView
  };
});
