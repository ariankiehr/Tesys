package org.tesys.core.estructures;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Developer {
    
    private String name;
    private String DisplayName;
    
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd,HH:00", timezone="ART")
    private Date timestamp;

    private List<Issue> issues = new LinkedList<Issue>();

    public Developer() {
	// jackson
    }

    public String getDisplayName() {
	return DisplayName;
    }

    public void setDisplayName(String displayName) {
	DisplayName = displayName;
    }

    public String getName() {
	return name;
    }

    public void setName(String name) {
	this.name = name;
    }

    public List<Issue> getIssues() {
	return issues;
    }

    public void setIssues(List<Issue> issues) {
	this.issues = issues;
    }
    
    public Date getTimestamp() {
        return timestamp;
    }
    
    public void addIssue(Issue i) {
    	this.issues.add(i);
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

}
