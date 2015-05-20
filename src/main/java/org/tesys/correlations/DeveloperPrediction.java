package org.tesys.correlations;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeveloperPrediction {
	
	private String user;
	private List<MetricPrediction> metricPred;
	
	public DeveloperPrediction() {}


	public DeveloperPrediction(String user, List<MetricPrediction> metricPred) {
		super();
		this.user = user;
		this.metricPred = metricPred;
	}


	public String getUser() {
		return user;
	}


	public void setUser(String user) {
		this.user = user;
	}


	public List<MetricPrediction> getMetricPred() {
		return metricPred;
	}


	public void setMetricPred(List<MetricPrediction> metricPred) {
		this.metricPred = metricPred;
	}

}
