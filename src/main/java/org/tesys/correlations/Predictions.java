package org.tesys.correlations;

import java.util.ArrayList;
import java.util.List;


import org.tesys.core.db.IssuesWithMetrics;
import org.tesys.core.estructures.Issue;

public class Predictions {
	
	/*public static void main(String[] args) {
		List<MetricPrediction> metricPrediction = getPredictions("etrapani", "lines", 600.0, 0.6);
	}*/

	public static List<MetricPrediction> getPredictions( String userKey, String metricKey, Double value, Double correlationVariation) {
		
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
						if( issue.getUser().equals(userKey) && metrics.get(i).equals(metricKey) ) {
							pearson1.add(issue.getMetrics().get(metrics.get(i)));
							pearson2.add(issue.getMetrics().get(metrics.get(j)));
						}

					}
					
					Double dou = Pearson.getCorrelation(pearson1, pearson2);
					
					if (dou>correlationVariation || dou < -correlationVariation) {
						//System.out.println(dou +" " +metrics.get(i) +" "+ metrics.get(j));
						List<Double> lr = LinearRegression.getRegression(pearson1, pearson2);
					    //System.out.println("y   = " + lr.get(0) + " * x + " + lr.get(1) + " (+/-) " + lr.get(2));
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
