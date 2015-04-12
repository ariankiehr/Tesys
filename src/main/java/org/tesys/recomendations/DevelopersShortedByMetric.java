package org.tesys.recomendations;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import org.tesys.core.db.AnalysisVersionsQuery;
import org.tesys.core.db.ElasticsearchDao;
import org.tesys.core.estructures.Developer;
import org.tesys.core.estructures.Issue;
import org.tesys.core.estructures.Metric;

public class DevelopersShortedByMetric {
	
	private Metric m;
	
	public DevelopersShortedByMetric(Metric m) {
		this.m = m;
	}
	
	public List<DeveloperWithOneAcumMetric> getDevelopersShortedByMetric() {
		
		List<DeveloperWithOneAcumMetric> developers = new LinkedList<DeveloperWithOneAcumMetric>();
		
		//Obtener los developers
		AnalysisVersionsQuery avq = new AnalysisVersionsQuery();
		
		List<Long> versiones = avq.execute();
		
		ElasticsearchDao<Developer> daod = new ElasticsearchDao<Developer>(Developer.class,
				ElasticsearchDao.DEFAULT_RESOURCE_DEVELOPERS
				+ versiones.get(versiones.size()-1));
		
		List<Developer> devs = daod.readAll();
		
		//Calcular cada metrica
		
		for (Developer d : devs) {
			DeveloperWithOneAcumMetric dwm = new DeveloperWithOneAcumMetric(d.getName(), null);
			for (Issue i : d.getIssues()) {
				
				Double val = m.evaluate(i);
				if( val != null) {
					if( dwm.getMetric() == null ) {
						dwm.setMetric(val);
					} else {
						dwm.setMetric( m.getType().add( dwm.getMetric() , val));
					}
				}
			}
			developers.add(dwm);
		}
		
		//ordenar por esa metrica
		
		Collections.sort(developers);
		
		return developers;
	}

}
