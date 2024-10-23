import { authRouter } from "@AppRoutes/authRouter";
import { userRouter } from "./userRoute";

/**
 * The `AppRoutes` class is responsible for initializing and configuring the routes of the application.
 */
export class AppRoutes {

	/**
	 * Initialize application middlewares. This method should be called during application startup.
	 */
	static initializeAppMiddleWares() {
		// You can add any middleware initialization here
	}

	/**
	 * Initialize application routes. This method should be called during application startup.
	 * It associates the route handlers (getRouter, postRouter, deleteRouter) with the Express application.
	 * @example
	 * AppRoutes.initializeAppRoutes();
	 */
	static initializeAppRoutes() {
		if (EXPRS.globalVariables) {
			// Configure routes based on global variables, e.g., API version
			EXPRS.app.use(`/wexa/`, authRouter, userRouter);
		}
	}
}
