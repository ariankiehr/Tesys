package org.tesys.correlations;

import java.util.HashMap;
import java.util.Map;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class MetricPrediction {
	
	private String issueId;
	private String user;
	private Map<String, Double> metrics;
	private Map<String, Double> deviations;
	
	public MetricPrediction() {}

	public MetricPrediction(String issueId, String user) {
		super();
		this.issueId = issueId;
		this.user = user;
		metrics = new HashMap<String, Double>();
		deviations = new HashMap<String, Double>();
	}
	
	public void putMetric(String key, Double value) {
		metrics.put(key, value);
	}
	
	public void putDeviation(String key, Double value) {
		deviations.put(key, value);
	}
	

	public String getIssueId() {
		return issueId;
	}

	public void setIssueId(String issueId) {
		this.issueId = issueId;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public Map<String, Double> getMetrics() {
		return metrics;
	}

	public void setMetrics(Map<String, Double> metrics) {
		this.metrics = metrics;
	}

	public Map<String, Double> getDeviations() {
		return deviations;
	}

	public void setDeviations(Map<String, Double> deviations) {
		this.deviations = deviations;
	}

}
