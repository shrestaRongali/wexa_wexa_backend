import express, { Express, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import 'module-alias/register';
import path from "path";
import { configDotenv } from "dotenv";
import { BaseApp } from "./lib/app/baseApp";
import { NotFoundError } from "@AppErrors/not-found-error";
import { errorHandler } from "@AppMiddleWares/error-handler";

const rateLimit = require('express-rate-limit');

/**
 * Create an instance of an Express application.
 * @type {Express}
 */
const appObj: Express = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    headers: true, // Send rate limit info in the `RateLimit-*` headers
  });

// Apply the rate limiting middleware to all requests
appObj.use(limiter)

// Enable Cross-Origin Resource Sharing (CORS) middleware.
appObj.use(cors());

// Parse incoming JSON requests with a size limit of 50MB.
appObj.use(express.json({ limit: "500mb" }));

// Parse incoming URL-encoded requests with a size limit of 50MB, extended mode, and parameter limit.
appObj.use(express.urlencoded({ limit: "500mb", extended: true, parameterLimit: 50000 }));

/**
 * Global variables to store the Express application instance, project folder path, and source directory path.
 * @global
 * @var {BaseApp} EXPRS - The Express application instance.
 * @var {string} projectFolderPath - The absolute path to the project folder.
 * @var {string} rootSourceDirectoryPath - The absolute path to the root source directory.
*/
configDotenv()

declare global {
    var EXPRS: BaseApp;
    var projectFolderPath: string;
    var rootSourceDirectoryPath: string;
}

// Resolve and store the project folder path.
global.projectFolderPath = path.resolve();

// Store the absolute path to the root source directory.
global.rootSourceDirectoryPath = __dirname;
console.log("Environment",process.env.NODE_ENV)

// Create a new instance of the BaseApp class and initialize it.
global.EXPRS = new BaseApp(appObj);
try{
    global.EXPRS.initialize();
}catch(error){
    console.error('Initialization error:', error);
}

// Check if globalVariables are defined in the BaseApp instance.
if (EXPRS.globalVariables) {
    // Define the port to listen on (either from environment variable or from globalVariables).
    const PORT = process.env.PORT || 6005;

    /**
     * Function to start the Express application and listen on the specified port.
     * @async
     */
    const start = async () => {
        appObj.listen(PORT, () => {
            console.log(`Listening onn port ${PORT}`);
        });
    };
    start();
}

// Import application routes.
import { AppRoutes } from "@AppRoutes/index";

try {
    AppRoutes.initializeAppMiddleWares();
    AppRoutes.initializeAppRoutes();
} catch (error) {
    console.error('Initialization error:', error);
}

// Handle all unmatched routes with a NotFoundError.
EXPRS.app.all('*', async (req: Request, res: Response) => {
    throw new NotFoundError();
});

// Use the errorHandler middleware to handle errors.
EXPRS.app.use(errorHandler);
