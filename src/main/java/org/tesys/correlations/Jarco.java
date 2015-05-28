package org.tesys.correlations;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
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
	
	public static Double mean(Double d1, Double d2) {
		if(d2==null) return d1;
		return (d1+d2)/2;
	}
	
	public static List<Issue> getIssues() {
		Map<String, Dos> mapa = generarMapa();
		
		
		IssuesWithMetrics is = new IssuesWithMetrics();
		List<Issue> l = is.execute();
		Issue i1=null,i2=null,i3=null,i4=null,i5=null;

		for (Issue issue : l) {
			if( issue.getUser().equals("etrapani") ) {
				i2 = new Issue(UUID.randomUUID().toString(), "ldominguez", "3", issue.getMetrics(), issue.getSkills());
			}
			if( issue.getUser().equals("emastrangelo") ) {
				i3 = new Issue(UUID.randomUUID().toString(), "mlongo", "3", issue.getMetrics(), issue.getSkills());
			}
			if( issue.getUser().equals("smarquez") ) {
				i4 = new Issue(UUID.randomUUID().toString(), "ecorvi", "3", issue.getMetrics(), issue.getSkills());
			}
			if( issue.getUser().equals("aespinosa") ) {
				i1 = new Issue(UUID.randomUUID().toString(), "mcattafesta", "3", issue.getMetrics(), issue.getSkills());
			}
			
			if( issue.getUser().equals("pgarcia") ) {
				i5 = new Issue(UUID.randomUUID().toString(), "fandrade", "3", issue.getMetrics(), issue.getSkills());
			}
		}
		
		l.add(i1);
		l.add(i2);
		l.add(i3);
		l.add(i4);
		l.add(i5);
		
		
		List<Issue> iss = new LinkedList<Issue>();
		
		Set<String> users = new HashSet<String>();
		
		for (Issue issue : l) {
			users.add(issue.getUser());
		}
		
		int issuesPorUser = 5;
		
		List<String> metrics = new ArrayList<String>();
		metrics.addAll(mapa.keySet());
		metrics.remove("quacode");
		metrics.remove("prec");
		
		for (String user : users) {
			
			Map<String, Double> hisMetrics = null;
			
			for (int j = 0; j < issuesPorUser; j++) {
				Issue ni = new Issue(UUID.randomUUID().toString()); //random string de id
				ni.setUser(user);
				ni.setIssueType("3");
				
				List<Skill> listskill = new LinkedList<Skill>();
				
				
				
				for (Issue isl : l) {
					if(isl.getUser().equals(user)) {
						listskill.addAll(isl.getSkills());
						hisMetrics = isl.getMetrics();
					}
				}
				
				ni.setSkills(listskill);
				
				for (String m : metrics) {
					Dos d = mapa.get(m);
					

					if(ni.getMetrics().get(m) == null) {
						
						Double ran = randomInRange(d.d1,d.d2);
						ni.addMetric(m, mean(ran, hisMetrics.get(m)) );
						List<MetricPrediction> lmp = Predictions.getPredictionsMean(m, ran, 0.5);
						for (MetricPrediction mp : lmp) {
							ni.addMetric(mp.getMetricKey(), mean(randomInRange(
																		mp.getMetricValue()-mp.getMetricDeviation(),
																		mp.getMetricValue()+mp.getMetricDeviation()),
																		hisMetrics.get(m)));
						}
					}
					
				}
				
				iss.add(ni);
				
				
			}
		}
		
		return iss;

	}

}
