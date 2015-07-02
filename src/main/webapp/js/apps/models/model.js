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


  // *** PREDICTIONS*** 
  

  var MetricPrediction = Backbone.Model.extend({
    idAttribute: 'key'
  });
  
  var MetricPredictionsCollection = Backbone.Collection.extend({
    model: MetricPrediction
  });

  // *** DEVELOPERS MODEL ***

  var IssuePrediction = Backbone.RelationalModel.extend({
    idAttribute: 'issueId'
  });

  var IssuePredictionCollection = Backbone.Collection.extend({
    model: IssuePrediction
  });


  var DeveloperPrediction = Backbone.RelationalModel.extend({
    idAttribute: 'name',
    relations: [{
      type: Backbone.HasMany, 
      key: 'issues',
      relatedModel: IssuePrediction,
      collectionType: IssuePredictionCollection,
      reverseRelation: {
        key: 'name',
        includeInJSON: 'id'
        // 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
      }
    }] 
  });

  var DeveloperPredictionCollection = Backbone.Collection.extend({
    model: DeveloperPrediction
  });

  return {
    Issue: Issue,
    IssueCollection: IssueCollection,
    Developer: Developer,
    DeveloperCollection: DeveloperCollection,
    Metric: Metric,
    MetricCollection: MetricCollection,
    Skill: Skill,
    SkillCollection: SkillCollection,

    DeveloperPredictionCollection: DeveloperPredictionCollection,
    DeveloperPrediction: DeveloperPrediction,
    IssuePredictionCollection: IssuePredictionCollection,
    IssuePrediction: IssuePrediction,
    MetricPredictionsCollection: MetricPredictionsCollection,
    MetricPrediction:MetricPrediction

  };

});