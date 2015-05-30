package org.tesys.correlations;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import org.tesys.core.analysis.skilltraceability.Skill;
import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.db.IssuesWithMetrics;
import org.tesys.core.estructures.Issue;



public class Predictions {
	
	public static void main(String[] args) {
		
		ElasticsearchDao<Issue> dao1 = new ElasticsearchDao<Issue>(Issue.class, ElasticsearchDao.DEFAULT_RESOURCE_SPRINT1);
		ElasticsearchDao<Issue> dao2 = new ElasticsearchDao<Issue>(Issue.class, ElasticsearchDao.DEFAULT_RESOURCE_SPRINT2);
		
		List<Issue> l = Jarco.getIssues();
		
		for (Issue issue : l) {
			dao1.create(issue.getIssueId(), issue);
			dao2.create(issue.getIssueId(), issue);
		}
		
		
	}

	public static List<DeveloperPrediction> getPredictions(String metricKey,
			Double value, Double correlationVariation, int sprint, List<String> skills) {

		List<MetricPrediction> metricPrediction;
		
		IssuesWithMetrics is = new IssuesWithMetrics(sprint);
		List<Issue> l = is.execute();

		
		List<Double> pearson1 = new ArrayList<Double>();
		List<Double> pearson2 = new ArrayList<Double>();
		List<String> metrics = new ArrayList<String>();
		List<DeveloperPrediction> developerPrediction = new LinkedList<DeveloperPrediction>();
		
		Set<String> users = new HashSet<String>();
		
		for (Issue issue : l) {
			users.add(issue.getUser());
		}

		metrics.addAll(l.get(0).getMetrics().keySet());
		metrics.remove("quacode");
		metrics.remove("prec");
		

		for (String userKey : users) {
			
			metricPrediction = new ArrayList<MetricPrediction>();

			for (int i = 0; i < metrics.size(); i++) {
				for (int j = 0; j < metrics.size(); j++) {
					if( i != j ) {
						
						pearson1 = new ArrayList<Double>();
						pearson2 = new ArrayList<Double>();
						
						for (Issue issue : l) {
							if( issue.getUser().equals(userKey) && metrics.get(i).equals(metricKey) ) { 
								List<String> isk = new LinkedList<String>();
								for (Skill sk : issue.getSkills()) {
									isk.add(sk.skillName);
								}
								
								if( isk.containsAll(skills) ) {
									pearson1.add(issue.getMetrics().get(metrics.get(i)));
									pearson2.add(issue.getMetrics().get(metrics.get(j)));
								}
	
							}
	
						}

						
						Double dou = Pearson.getCorrelation(pearson1, pearson2);
						
						if (dou>correlationVariation || dou < -correlationVariation) {

							List<Double> lr = LinearRegression.getRegression(pearson1, pearson2);
							MetricPrediction mp = new MetricPrediction( metrics.get(j), lr.get(0)*value+lr.get(1), lr.get(2));
							metricPrediction.add(mp);
						}
						
					}
	
				}
			}
			
			developerPrediction.add( new DeveloperPrediction(userKey, metricPrediction) );
		
		}
		return developerPrediction;
		
	}
	
	
	
	public static List<MetricPrediction> getPredictionsMean( String metricKey, 
			Double value, Double correlationVariation) {
		
		List<MetricPrediction> metricPrediction = new ArrayList<MetricPrediction>();
		
		IssuesWithMetrics is = new IssuesWithMetrics(0);
		List<Issue> l = is.execute();

		
		List<Double> pearson1 = new ArrayList<Double>();
		List<Double> pearson2 = new ArrayList<Double>();
		List<String> metrics = new ArrayList<String>();
		
		
		metrics.addAll(l.get(0).getMetrics().keySet());
		metrics.remove("quacode");
		metrics.remove("prec");
		
		for (int i = 0; i < metrics.size(); i++) {
			for (int j = 0; j < metrics.size(); j++) {
				if( i != j ) {
					
					for (Issue issue : l) {
						if( metrics.get(i).equals(metricKey) ) { 
							List<String> isk = new LinkedList<String>();
							for (Skill sk : issue.getSkills()) {
								isk.add(sk.skillName);
							}
							
							pearson1.add(issue.getMetrics().get(metrics.get(i)));
							pearson2.add(issue.getMetrics().get(metrics.get(j)));

						}

					}
					
					Double dou = Pearson.getCorrelation(pearson1, pearson2);
					
					if (dou>correlationVariation || dou < -correlationVariation) {
						List<Double> lr = LinearRegression.getRegression(pearson1, pearson2);
						MetricPrediction mp = new MetricPrediction(metrics.get(j), lr.get(0)*value+lr.get(1), lr.get(2));
						metricPrediction.add(mp);
					}
					

					pearson1.clear();
					pearson2.clear();
					
				}

			}
		}
		
		
		return metricPrediction;
		
	}
	
	
	
}
