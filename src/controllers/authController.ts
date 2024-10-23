import { Request, Response, NextFunction } from "express";
import { Op } from 'sequelize';
import bcrypt from "bcrypt";

import { DefaultController } from "@AppControllers/defaultController";

import { BadRequestError } from "@AppErrors/bad-request-error";
import { User } from "@AppModels/app";
import moment from "moment";

/**
 * Controller class for handling user sign-up.
 * @extends DefaultController
 */
export class AuthController extends DefaultController {
	/**
	 * Creates an instance of SignupController.
	 * @param {Request} request - The Express.js request object.
	 * @param {Response} response - The Express.js response object.
	 * @param {NextFunction} next - The Express.js next function.
	 */
	constructor(request: Request, response: Response, next: NextFunction) {
		super(request, response, next);
	}

    async signup() {
		try{
        const { email, name, phone, otp, password, confirmPassword} = this.getRequestObj().body

		const userModel = this.getAppObj().models.users;
		let user: User | null = await this._globalService.findOne(userModel, {  
			[Op.or]: [
            { email: email },
            { phone: phone }
        ] }) as User | null;

		if (user) {
			throw new BadRequestError("Email/Mobile number already in use");
		}

		const UserOtpModel = this.getAppObj().models.user_otps
		const otpVerify = await this._globalService.findOne(UserOtpModel,{phone: phone,otp: otp})
		if(!otpVerify){
			throw new BadRequestError("Invalid OTP")
		}

		
		if(password!=confirmPassword){
			throw new BadRequestError("Password mismatch")
		}
		
		// Hash the password using bcrypt
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		
        const userRegister: any = await this._globalService.insertRecord(userModel,{name: name,phone: phone,email: email,password: hashedPassword})
		
		const session = this.generateSession(email);
		
		const sessionDetails = this.generateUserToken({
			email: email,
			phone: phone,
			id: userRegister.id,
			name: name,
		}, session);

		//delete otp record
		await this._globalService.deleteRecords(UserOtpModel,{phone: phone})

		await this._globalService.updateRecords(userModel,{last_log_in: moment().format("YYYY-MM-DD HH:mm:ss")},{id: userRegister.id})

		// Store the token in your cache or session management system
		await this.storeSessionToken(session, sessionDetails.token);

        this.setResponseData({
			name: name,
			key: sessionDetails.session,
			token: sessionDetails.token
		});
		this.setMessage("User Signup successful.");
		this.setSuccess(true);
		this.sendResponse();
	}catch(error: any){
		throw error
	}
    }

    async sendSignupOtp() {
		try{
        const { email, phone } = this.getRequestObj().body

		const userModel = this.getAppObj().models.users;
		let user: User | null = await this._globalService.findOne(userModel, {  
			[Op.or]: [
            { email: email },
            { phone: phone }
        ] }) as User | null;

		if (user) {
			throw new BadRequestError("Email/Mobile number already in use");
		}

		let otp;
    	if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
      		otp = 9876;
    	} else {
      		otp = Math.floor(1000 + Math.random() * 9000);
    	}

		console.log("jbhgyuikjm")
		const UserOtpModel = this.getAppObj().models.user_otps
		await this._globalService.insertRecord(UserOtpModel,{phone: phone,otp: otp})

		// await this._globalService.sendSMS("+91"+phone,otp.toString())

		this.setMessage("OTP sent successfully.");
		this.setSuccess(true);
		this.sendResponse();
	}catch(error){
		throw error
	}
    }

    async login() {
		try{
        const { username, password } = this.getRequestObj().body

		const userModel = this.getAppObj().models.users;
		let user: User | null = await this._globalService.findOne(userModel, {  
			[Op.or]: [
            { email: username },
            { phone: username }
        ] }) as User | null;

		if (!user) {
			throw new BadRequestError("Email/Mobile does not exist");
		}

		const validPassword = await bcrypt.compare(password, user.password!)
		if(!validPassword){
			throw new BadRequestError("Incorrect password")
		}

		const session = await this.generateSession(user.email);
		
		const sessionDetails = await this.generateUserToken({
			email: user.email,
			phone: user.phone,
			id: user.id,
			name: user.name,
		}, session);

		await this._globalService.updateRecords(userModel,{last_log_in: moment().format("YYYY-MM-DD HH:mm:ss")},{id: user.id})


		// Store the token in your cache or session management system
		await this.storeSessionToken(session, sessionDetails.token);

		this.setResponseData({
			name: user.name,
			key: sessionDetails.session
		})
		this.setMessage("login successful.");
		this.setSuccess(true);
		this.sendResponse();
	}catch(error){
		throw error
	}
    }

}