package org.tesys.correlations;

import java.util.LinkedList;
import java.util.List;


public class LinearRegression {
	
	/*
	 *  Reads in a sequence of pairs of real numbers and computes the
	 *  best fit (least squares) line y  = ax + b through the set of points.
	 *  Devuelve a y b en una lista y a lo ultimo el error (desviacion)
	 *  lx.size == ly.size
	 */
	public static List<Double> getRegression(List<Double> lx, List<Double> ly) {

	    double sumx = 0.0, sumy = 0.0, sumx2=0.0;
	    
	    for (int i = 0; i < lx.size(); i++) {
	    	sumx += lx.get(i);
	    	sumx2 += lx.get(i) * lx.get(i);
	    	sumy += ly.get(i);
		}
	    
	    double xbar = sumx / lx.size();
	    double ybar = sumy / ly.size();
	    
	    double xxbar = 0.0, xybar = 0.0;
	    for (int i = 0; i < lx.size(); i++) {
	        xxbar += (lx.get(i) - xbar) * (lx.get(i) - xbar);
	        xybar += (lx.get(i) - xbar) * (ly.get(i) - ybar);
	    }
	    double beta1 = xybar / xxbar;
	    double beta0 = ybar - beta1 * xbar;
	    
        int df = lx.size() - 2;
        double rss = 0.0;      // residual sum of squares
        for (int i = 0; i < lx.size(); i++) {
            double fit = beta1*lx.get(i) + beta0;
            rss += (fit - ly.get(i)) * (fit - ly.get(i));
        }
        
        double svar  = rss / df;
        double svar1 = svar / xxbar;
        double svar0 = svar/lx.size() + xbar*xbar*svar1;

        svar0 = svar * sumx2 / (lx.size() * xxbar);

	    List<Double> result = new LinkedList<Double>();
	    result.add(beta1);
	    result.add(beta0);
	    result.add( Math.sqrt(svar0) ); //error
	    return result;
	    
	}


}
