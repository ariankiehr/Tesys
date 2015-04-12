package org.tesys.core.estructures.metrictypes;

public class NumericMetric implements MetricTypeDescriptor {

	@Override
	public Double add(Double a, Double b) {
		return a+b;
	}

	@Override
	public Double avg(Double a, Double b) {
		return (a+b)/2.0;
	}

	@Override
	public String toString() {
		return "numeric";
	}
	
	


}
