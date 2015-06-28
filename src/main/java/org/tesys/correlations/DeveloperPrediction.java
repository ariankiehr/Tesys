package org.tesys.correlations;

import java.util.LinkedList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeveloperPrediction {
	
	private String name;
	private String displayName;
	private List<MetricPrediction> issues;

	public DeveloperPrediction() {}


	public DeveloperPrediction(String user, String userDisplay, MetricPrediction metricPred) {
		super();
		this.name = user;
		this.displayName = userDisplay;
		this.issues = new LinkedList<MetricPrediction>();
		this.issues.add(metricPred);
	}
	
	
	public String getUserDisplay() {
		return displayName;
	}


	public void setUserDisplay(String userDisplay) {
		this.displayName = userDisplay;
	}



	public String getUser() {
		return name;
	}


	public void setUser(String user) {
		this.name = user;
	}


	public List<MetricPrediction> getMetricPred() {
		return issues;
	}


	public void setMetricPred(List<MetricPrediction> metricPred) {
		this.issues = metricPred;
	}

}
