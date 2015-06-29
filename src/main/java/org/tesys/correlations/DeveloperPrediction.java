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
	
	
	public String getDisplayName() {
		return displayName;
	}


	public void setDisplayName(String userDisplay) {
		this.displayName = userDisplay;
	}



	public String getName() {
		return name;
	}


	public void setName(String user) {
		this.name = user;
	}


	public List<MetricPrediction> getIssues() {
		return issues;
	}


	public void setIssues(List<MetricPrediction> metricPred) {
		this.issues = metricPred;
	}

}
