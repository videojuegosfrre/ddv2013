/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.frre.ddv2013.logging;

import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.apache.log4j.xml.DOMConfigurator;

/**
 * Logs ITOPS errors.
 */
public final class DefaultLogger {
    
	static {
	           DOMConfigurator.configure("config/log4j.xml");
	}
	
	private static String START_DELIMITER = "{:~ ";
	private static String END_DELIMITER = " ~:}";
	
	private Logger theLogger;
	private StringBuilder msgBuilder = new StringBuilder();

	
	public void setLogger(String name){
		this.theLogger = Logger.getLogger(name);
	}
	
	public void setLogger(Class name){
		this.theLogger = Logger.getLogger(name);
	}
	
	public void setDefaultLogger(){
		this.theLogger = Logger.getRootLogger();
	}

	public static DefaultLogger getLogger() {
		DefaultLogger logggerInstance = new DefaultLogger();
		logggerInstance.setDefaultLogger();
		return logggerInstance;
	}
	
	public static DefaultLogger getLogger(Class classReference) {
		DefaultLogger logggerInstance = new DefaultLogger();
		logggerInstance.setLogger(classReference);
		return logggerInstance;
	}
	
	public static DefaultLogger getLogger(String loggerName) {
		DefaultLogger logggerInstance = new DefaultLogger();
		logggerInstance.setLogger(loggerName);
		return logggerInstance;
	}

	public void logError(Object classOwner, String message, Exception e) {
		makeBody(classOwner, message);
		msgBuilder.append("\n Stack: ");
		StackTraceElement[] stack = e.getStackTrace();
		for (StackTraceElement stackTraceElement : stack) {
			msgBuilder.append(stackTraceElement);
			msgBuilder.append("\n");
		}
		theLogger.error(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);

	}

    public void logDebug(Object classOwner, String message){
        makeBody(classOwner, message);
        theLogger.debug(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
    }

    public void logDebug(String message) {
        makeBody(this, message);
        theLogger.debug(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
    }

	public void logError(Object classOwner, String message) {
		makeBody(classOwner, message);
		theLogger.error(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	public void logError(String message) {
		makeBody(this, message);
		theLogger.error(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	public void logWarning(Object classOwner, String message) {
		makeBody(classOwner, message);
		theLogger.warn(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	public void logWarning(String message) {
		makeBody(this, message);
		theLogger.warn(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	public void logInfo(Object classOwner, String message) {
		makeBody(classOwner, message);
		theLogger.info(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	public void logInfo(String message) {
		makeBody(this, message);
		theLogger.info(START_DELIMITER+msgBuilder.toString()+END_DELIMITER);
	}

	private void makeBody(Object classOwner, String message) {
		msgBuilder.delete(0, msgBuilder.length());
		String className = classOwner.getClass().getCanonicalName();
		if (!className.equalsIgnoreCase(this.getClass().getCanonicalName())) {
			msgBuilder.append(" className:");
			msgBuilder.append(className);
		}
		msgBuilder.append(" ");
		msgBuilder.append(message);
	}
}

