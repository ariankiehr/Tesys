package org.tesys.correlations;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MetricPrediction {
	
	private String metricKey;
	private Double metricValue;
	private Double metricDeviation;
	
	public MetricPrediction() {}

	public MetricPrediction(String metricKey, Double metricValue,
			Double metricDeviation) {
		super();
		this.metricKey = metricKey;
		this.metricValue = metricValue;
		this.metricDeviation = metricDeviation;
	}


	public Double getMetricDeviation() {
		return metricDeviation;
	}

	public void setMetricDeviation(Double metricDeviation) {
		this.metricDeviation = metricDeviation;
	}

	public String getMetricKey() {
		return metricKey;
	}
	public void setMetricKey(String metricKey) {
		this.metricKey = metricKey;
	}
	public Double getMetricValue() {
		return metricValue;
	}
	public void setMetricValue(Double metricValue) {
		this.metricValue = metricValue;
	}

}
