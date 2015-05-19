package org.tesys.correlations;

import java.util.List;

public class Pearson {
	
	public static double getCorrelation(List<Double> xVect,
			List<Double> yVect) {
		double meanX = 0.0, meanY = 0.0;
		for (int i = 0; i < xVect.size(); i++) {
			meanX += xVect.get(i);
			meanY += yVect.get(i);
		}

		meanX /= xVect.size();
		meanY /= yVect.size();

		double sumXY = 0.0, sumX2 = 0.0, sumY2 = 0.0;
		for (int i = 0; i < xVect.size(); i++) {
			sumXY += ((xVect.get(i) - meanX) * (yVect.get(i) - meanY));
			sumX2 += Math.pow(xVect.get(i) - meanX, 2.0);
			sumY2 += Math.pow(yVect.get(i) - meanY, 2.0);
		}

		return (sumXY / (Math.sqrt(sumX2) * Math.sqrt(sumY2)));
	}

}
