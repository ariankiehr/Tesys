define(
  [ 'jquery', 
    'underscore', 
    'backbone',
    'tesys',
    'bar',
    'radar',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    tesys,
    bar,
    radar
  ) {

  // *** SKILLS FOR RECOMENDATIONS ***
  var SkillView = Backbone.View.extend({
    //constants definition
    UNSELECTED_COLOR: "white", 
    SELECTED_COLOR: "darksalmon",
    //end const definition
    tagName: 'li', 
    events: {
      'click': 'select'
    },
    initialize: function(options){
      this.options = options || {};

      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render' ,'select');
      this.isSelected = false;
      this.render();
    },
    render: function() {
      this.el.id = this.model.get('key') ;
      this.el.innerHTML = '' ;
      var textContainer = document.createElement('a');
      textContainer.textContent = this.model.get('nombre');
      this.el.appendChild(textContainer) ;
      return this ;
    },
    select: function() {
      this.isSelected = !this.isSelected;
      if(this.isSelected) {
        this.el.style.backgroundColor = this.SELECTED_COLOR ;
        this.options.selectedSkills.array.push(this.model.get('key'));
      } else {
        this.el.style.backgroundColor = this.UNSELECTED_COLOR ;
        this.options.selectedSkills.array = _.without(
          this.options.selectedSkills.array, 
          this.model.get('key')
        );
      }
    }
  });

  var SkillCollectionView = Backbone.View.extend({
  //  el: $('#metrics'), // el attaches to existing element
    initialize: function(options){
      this.options = options || {};
      // every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'appendItem');

      //Event subscription
      this.collection.on({'reset': this.render});
      
      this.render();
    },
    render: function(){
      var self = this;
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.appendItem(item);
      });
      return this;
    },
    appendItem: function(item){
      var metricView = new SkillView(
        { model: item, 
          selectedSkills: this.options.selectedSkills,
        }
      );
      this.$el.append(metricView.render().el);
    }
  });



  return {
    SkillCollectionView: SkillCollectionView,
  };
});