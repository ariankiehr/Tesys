package org.tesys.core.analysis.sonar.metricsdatatypes;


public class INT implements Metrics {

  Integer actual, anterior;

  public INT(String actual, String anterior) {
    this.actual = Integer.valueOf(actual);
    if ("null".equals(anterior)) {
      this.anterior = 0;
    } else {
      this.anterior = Integer.valueOf(anterior);
    }

  }

  public String getDifferenceBetweenAnalysis() {
    return String.valueOf(actual - anterior);
  }

  public String getNewAnalysisPerTask() {
    return String.valueOf(actual + anterior);
  }


}
