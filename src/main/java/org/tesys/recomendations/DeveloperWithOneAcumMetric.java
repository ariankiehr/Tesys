package org.tesys.recomendations;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeveloperWithOneAcumMetric implements Comparable<DeveloperWithOneAcumMetric> {

	protected String developer;

	protected Double metric;
	
	public DeveloperWithOneAcumMetric() {
	// needed for jackson
    }
	
	public DeveloperWithOneAcumMetric(String developer, Double metric) {
		super();
		this.developer = developer;
		this.metric = metric;
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


	@Override
	public int compareTo(DeveloperWithOneAcumMetric d) {
		if ( this.metric == null && d.metric == null ) {
			return 0;
		}
		if ( this.metric == null && d.metric != null ) {
			return 1;
		}
		if ( this.metric != null && d.metric == null ) {
			return -1;
		}

		if( this.metric < d.metric ) {
			return 1;
		}
		if( this.metric > d.metric ) {
			return -11;
		}
		
		return 0;
	}
	
}
