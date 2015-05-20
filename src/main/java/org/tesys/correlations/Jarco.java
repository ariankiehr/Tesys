package org.tesys.correlations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.tesys.core.analysis.skilltraceability.Skill;
import org.tesys.core.db.IssuesWithMetrics;
import org.tesys.core.estructures.Issue;

class Dos {
	public Double d1,d2;
	public Dos(Double s1, Double s2) { d1=s1;d2=s2; }
}

public class Jarco {

	protected static Random random = new Random();
	public static double randomInRange(double min, double max) {
	  double range = max - min;
	  double scaled = random.nextDouble() * range;
	  double shifted = scaled + min;
	  return shifted; // == (rand.nextDouble() * (max-min)) + min;
	}
	
	public static Map<String, Dos> generarMapa() {


		IssuesWithMetrics is = new IssuesWithMetrics();
		List<Issue> l = is.execute();

		List<Double> nums = new ArrayList<Double>();
		List<String> metrics = new ArrayList<String>();

		metrics.addAll(l.get(0).getMetrics().keySet());
		metrics.remove("quacode");
		metrics.remove("prec");
		
		Map<String, Dos> mapa = new HashMap<String, Dos>();

		for (String metric : metrics) {
			nums.clear();
			Double mean = 0.0;
			double varianza = 0.0;
			double desviacion = 0.0;

			for (Issue issue : l) {
				nums.add(issue.getMetrics().get(metric));
			}

			for (Double d : nums) {
				mean += d;
			}
			mean = mean / nums.size();

			for (int i = 0; i < nums.size(); i++) {
				double rango;
				rango = Math.pow(nums.get(i) - mean, 2);
				varianza = varianza + rango;
			}
			varianza = varianza / nums.size();
			desviacion = Math.sqrt(varianza);
			
			double rango1, rango2;
			
			rango1 = mean - (desviacion);
			rango2 = mean + (desviacion);

			mapa.put(metric, new Dos(rango1,rango2));

		}

		return mapa;
		
	}
	
	public static List<Issue> getIssues() {
		Map<String, Dos> mapa = generarMapa();
		
		
		IssuesWithMetrics is = new IssuesWithMetrics();
		List<Issue> l = is.execute();
		
		List<Issue> iss = new LinkedList<Issue>();
		String [] users = {"etrapani", "mantunez", "gsanmartin", "smarquez", "rpastore"};
		
		int nissues = 25;
		
		List<String> metrics = new ArrayList<String>();
		metrics.addAll(mapa.keySet());
		metrics.remove("quacode");
		metrics.remove("prec");
		
		for (int i = 0; i < users.length; i++) {
			for (int j = 0; j < nissues/users.length; j++) {
				Issue ni = new Issue(UUID.randomUUID().toString()); //random string de id
				ni.setUser(users[i]);
				ni.setIssueType("3");
				
				List<Skill> listskill = new LinkedList<Skill>();
				
				for (Issue isl : l) {
					if(isl.getUser().equals(users[i])) {
						listskill.addAll(isl.getSkills());
					}
				}
				
				ni.setSkills(listskill);
				
				for (String m : metrics) {
					Dos d = mapa.get(m);
					

					if(ni.getMetrics().get(m) == null) {
						
						Double ran = randomInRange(d.d1,d.d2);
						ni.addMetric(m, ran);
						List<MetricPrediction> lmp = Predictions.getPredictionsMean(m, ran, 0.5);
						for (MetricPrediction mp : lmp) {
							ni.addMetric(mp.getMetricKey(), randomInRange(
																		mp.getMetricValue()-mp.getMetricDeviation(),
																		mp.getMetricValue()+mp.getMetricDeviation()));
						}
					}
					
				}
				
				iss.add(ni);
				
				
			}
		}
		
		return iss;

	}

}
