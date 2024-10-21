import { Request, Response, NextFunction } from "express";
import moment from "moment";
import { Op } from 'sequelize';
import { DefaultController } from "@AppControllers/defaultController";
import { BadRequestError } from "@AppErrors/bad-request-error";
import { S3Service } from "@AppServices/s3/s3Service";
import { CommonService } from "@AppServices/db/commonService";

/**
 * Controller class for handling user sign-up.
 * @extends DefaultController
 */
export class UserController extends DefaultController {
    private _s3Service: S3Service;
    private _commonService: CommonService;
	/**
	 * Creates an instance of SignupController.
	 * @param {Request} request - The Express.js request object.
	 * @param {Response} response - The Express.js response object.
	 * @param {NextFunction} next - The Express.js next function.
	 */
	constructor(request: Request, response: Response, next: NextFunction) {
		super(request, response, next);
        this._s3Service = new S3Service();
        this._commonService = new CommonService();
	}

    async getUserDetails(){
        try{
            const user_id = this.getRequestObj().currentUser?.id

			if(!user_id){
				throw new BadRequestError("Invalid User_id")
			}
			const user: any = await this._commonService.getUser(user_id!)
			console.log(user)

			this.setResponseData(user[0]);
			this.setMessage("User Data retrieved");
			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async updateUserDetails(){
        try{
            const user_id = this.getRequestObj().currentUser?.id
			const file = this.getRequestObj().files as Express.Multer.File[];
			const name = this.getRequestObj().body.name
			const email = this.getRequestObj().body.email
			const phone = this.getRequestObj().body.phone

			if(!user_id){
				throw new BadRequestError("Invalid User_id")
			}

			let url
			const userModel = this.getAppObj().models.users
			const transaction = await this.getAppObj().dBObject?.transaction();
			try{
				await this._globalService.updateRecords(userModel,{name,phone,email},{id: user_id},transaction)
				if (file.length > 0) {
					const imagesModel = this.getAppObj().models.ct_images;
			
					for (const i in file) {
						const newFileName = file[i].originalname.replace(/\s/g, "-");
			
							await this._s3Service.uploadLocalFileToS3(
								file[i].buffer,
								this.getAppObj().globalVariables.EXPRS_CDN_BUCKET,
								"wexa/" + user_id?.toString() + "/dp",
								newFileName,
								file[i].mimetype,
								"private");
			
							const image_path = "wexa/" + user_id?.toString() + "/dp/" + newFileName
			
							const imageExist = await this._globalService.findOne(imagesModel,{user_id}) 
							if(imageExist){
								await this._globalService.updateRecords(imagesModel,{image_url: image_path},{user_id})
							}else{
								await this._globalService.insertRecord(imagesModel,{
									user_id: user_id,
									image_url: image_path,
									created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
								})
							}
							url = this.getAppObj().globalVariables.EXPRS_CDN_URL + image_path;
						}
				}
				await transaction?.commit()
			}catch(e){
				console.log(e)
				await transaction?.rollback();
				throw new BadRequestError("Error updating user details")
			}

			this.setResponseData({id: user_id,name, phone, email, url});
			this.setMessage("User Data Updated");
			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async sendRequest(){
        try{
            const from_user_id = this.getRequestObj().currentUser?.id
            const to_user_id = this.getRequestObj().query.id
			

			if(!from_user_id || !to_user_id){
				throw new BadRequestError("Invalid User_id")
			}

			const requestModel = this.getAppObj().models.requests
			const requestExists = await this._globalService.findOne(requestModel,{[Op.or]: [
				{ from_user_id, to_user_id },
				{ from_user_id: to_user_id, to_user_id: from_user_id}]})

			if(!requestExists){
				await this._globalService.insertRecord(requestModel,{
					from_user_id, 
					to_user_id, 
					created_at:moment().format("YYYY-MM-DD HH:mm:ss"),
					updated_at:moment().format("YYYY-MM-DD HH:mm:ss")
				})
				this.setMessage("Friend Request Sent");
			}else{
				this.setMessage("Request Approval Pending");
			}

			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async acceptRequest(){
        try{
            const to_user_id = this.getRequestObj().currentUser?.id
            const from_user_id = this.getRequestObj().body.from_user_id
			const accept = this.getRequestObj().body.accept
			
			if(!from_user_id || !to_user_id){
				throw new BadRequestError("Invalid User_id")
			}

			const requestModel = this.getAppObj().models.requests
			const requestExists = await this._globalService.findOne(requestModel,{from_user_id, to_user_id})

			if(!requestExists){
				throw "No Request Exists"
			}else{
				await this._globalService.updateRecords(requestModel,{status: accept? 2: 3, updated_at: moment().format("YYYY-MM-DD HH:mm:ss")},{from_user_id,to_user_id})
				this.setMessage(`Request ${accept? "Accepted" : "Declined"}`)
			}

			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async getFriends(){
        try{
            const user_id = this.getRequestObj().currentUser?.id
			
			if(!user_id){
				throw new BadRequestError("Invalid User_id")
			}

			const friends = await this._commonService.getList(user_id)

			this.setMessage("Retrieved List")
			this.setResponseData(friends)
			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async sendChat(){
        try{
            const from_user = this.getRequestObj().currentUser?.id
			const to_user = this.getRequestObj().body.to_user
			const message = this.getRequestObj().body.message
			
			if(!from_user){
				throw "Invalid User_id"
			}

			const chatModel = this.getAppObj().models.chats
			await this._globalService.insertRecord(chatModel,{from_user,to_user,message})

			this.setMessage("Chat Sent")
			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }

    async getChat(){
        try{
            const from_user = this.getRequestObj().currentUser?.id
			const to_user = this.getRequestObj().query.id?.toString()
			
			if(!from_user || !to_user){
				throw "Invalid User_id"
			}

			const limit = parseInt(this.getRequestObj().query.limit as string, 10) || 15; // Default limit to 10
		    const page = parseInt(this.getRequestObj().query.page as string, 10) || 1; // Default page to 1

		    // Calculate the offset based on the page number
		    const offset = (page - 1) * limit;

			const chats = await this._commonService.getChat(from_user,to_user,limit,offset)

			this.setMessage("Chat Retrieved")
			this.setResponseData(chats)
			this.setSuccess(true);
			this.sendResponse();
        }catch(e: any){
            throw new BadRequestError(e)
        }
    }
}