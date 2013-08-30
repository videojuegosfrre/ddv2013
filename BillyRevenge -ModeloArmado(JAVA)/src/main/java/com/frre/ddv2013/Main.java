package com.frre.ddv2013;

import com.frre.ddv2013.logging.DefaultLogger;

/**
 *
 * @author Justo Vargas
 */
public class Main {
    
    public static DefaultLogger logger = DefaultLogger.getLogger();
    /*
     * Punto de entrada del Juego
     */
    public static void main(String[] args){
        logger.logInfo(Main.class, "Comienza mi super programa");
        System.out.println("Hola Mundo!!!");
        logger.logError(Main.class, "El hola mundo rompio todoo!!!");
    }
    
}
