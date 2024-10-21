import { BaseApp } from "../app/baseApp";

class BaseHelper {

	protected _appObj: BaseApp;

	constructor(_appObj: BaseApp) {
		this._appObj = _appObj;
	}

	initialize() { }
}
export { BaseHelper };
