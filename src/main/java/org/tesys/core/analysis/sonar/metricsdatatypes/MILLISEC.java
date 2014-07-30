package org.tesys.core.analysis.sonar.metricsdatatypes;

import com.fasterxml.jackson.databind.JsonNode;


public class MILLISEC implements Metrics {

  Integer actual, anterior;

  public MILLISEC(JsonNode actual, JsonNode anterior) {
    this.actual = actual.asInt();
    if (anterior == null) {
      this.anterior = 0;
    } else {
      this.anterior = anterior.asInt();
    }
  }

  public String getDifferenceBetweenAnalysis() {
    return String.valueOf(actual - anterior);
  }

  public String getNewAnalysisPerTask() {
    return String.valueOf(actual + anterior);
  }


}
