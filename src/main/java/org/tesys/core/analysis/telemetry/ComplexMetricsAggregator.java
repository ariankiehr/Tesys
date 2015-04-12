package org.tesys.core.analysis.telemetry;

import java.util.List;

import org.tesys.core.db.MetricDao;
import org.tesys.core.estructures.Issue;
import org.tesys.core.estructures.Metric;
import org.tesys.core.estructures.metricvalue.SimpleValue;

public class ComplexMetricsAggregator extends AggregatorDecorator {

	
	private MetricDao dao;
	
	public ComplexMetricsAggregator(Aggregator aggregator) {
		super(aggregator);
		
		dao = new MetricDao();
	}

	@Override
	public Issue agregateMetrics(Issue i) {
		i = super.agregateMetrics(i);
		
		List<Metric> storeMetrics = dao.readAll();
		
		//Se juntan todas las metricas complejas
		for (Metric metric : storeMetrics) {
			if( ! (metric.getValue() instanceof SimpleValue)  ) {
				i.addMetric( metric.getKey()  , metric.evaluate(i) );
			}
		}
		
		return i;
	}

	@Override
	public List<Metric> getMetricsID() {
		// Se juntan la de los demas programas
		List<Metric> metrics = super.aggregator.getMetricsID();
		
		List<Metric> storeMetrics = dao.readAll();
		
		//Se juntan todas las metricas complejas
		for (Metric metric : storeMetrics) {
			if( ! (metric.getValue() instanceof SimpleValue)  ) {
				metrics.add(metric);
			}
		}
		
		return metrics;
	}

}
