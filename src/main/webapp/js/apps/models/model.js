define(
  [ 'jquery',
    'underscore',
    'backbone',
    'tesys',
    'backbone-relational',
    'bootstrap'
  ], 
  function($, _, 
    Backbone, 
    tesys
  ) {

  // *** SKILLS MODEL ***
  
  var Skill = Backbone.RelationalModel.extend({
    idAttribute: ''
  });

  var SkillCollection = Backbone.Collection.extend({
    model: Skill
  });

  // *** METRICS MODEL ***

  var Metric = Backbone.Model.extend({
    idAttribute: 'key'
  });
  
  var MetricCollection = Backbone.Collection.extend({
    model: Metric
  });

  // *** DEVELOPERS MODEL ***

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

  return {
    Issue: Issue,
    IssueCollection: IssueCollection,
    Developer: Developer,
    DeveloperCollection: DeveloperCollection,
    Metric: Metric,
    MetricCollection: MetricCollection,
    Skill: Skill,
    SkillCollection: SkillCollection
  };

});