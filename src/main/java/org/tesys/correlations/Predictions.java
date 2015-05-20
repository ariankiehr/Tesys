package org.tesys.correlations;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.tesys.core.analysis.skilltraceability.Skill;
import org.tesys.core.db.IssuesWithMetrics;
import org.tesys.core.estructures.Issue;



public class Predictions {
	
	public static void main(String[] args) {
		
		List<String> skills =  new LinkedList<String>();
		skills.add("Client side skills");
		
		List<MetricPrediction> m = getPredictions("etrapani", "lines", 600.0, 0.6, skills);
		for (MetricPrediction metricPrediction : m) {
			System.out.println(metricPrediction.getMetricKey() + " " + metricPrediction.getMetricValue());
		}
	}

	public static List<MetricPrediction> getPredictions( String userKey, String metricKey, 
			Double value, Double correlationVariation, List<String> skills) {
		
		List<MetricPrediction> metricPrediction = new ArrayList<MetricPrediction>();
		
		/*IssuesWithMetrics is = new IssuesWithMetrics();
		List<Issue> l = is.execute();*/
		
		List<Issue> l = Jarco.getIssues();

		
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
	
	
	
	public static List<MetricPrediction> getPredictionsMean( String metricKey, 
			Double value, Double correlationVariation) {
		
		List<MetricPrediction> metricPrediction = new ArrayList<MetricPrediction>();
		
		IssuesWithMetrics is = new IssuesWithMetrics();
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
