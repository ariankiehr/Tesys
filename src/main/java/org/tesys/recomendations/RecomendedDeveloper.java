package org.tesys.recomendations;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecomendedDeveloper {
	
	protected String developer;
	protected Double metric;
	protected Double trust;
	protected Double similarity;
	
	public RecomendedDeveloper() {}
	
	public RecomendedDeveloper(String developer, Double metric, Double trust,
			Double similarity) {
		super();
		this.developer = developer;
		this.metric = metric;
		this.trust = trust;
		this.similarity = similarity;
	}

	public String getDeveloper() {
		return developer;
	}

	public void setDeveloper(String developer) {
		this.developer = developer;
	}

	public Double getMetric() {
		return metric;
	}

	public void setMetric(Double metric) {
		this.metric = metric;
	}

	public Double getTrust() {
		return trust;
	}

	public void setTrust(Double trust) {
		this.trust = trust;
	}

	public Double getSimilarity() {
		return similarity;
	}

	public void setSimilarity(Double similarity) {
		this.similarity = similarity;
	}
	

}
