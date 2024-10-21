import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";
import { DataError } from '@AppErrors/data-error';
import { DefaultService } from "@AppServices/defaultService";
/**
 * Service class for handling file uploads to AWS S3.
 */
export class S3Service extends DefaultService {

	constructor() {
		super();
	}
	
	/**
	 * Uploads a local file to an AWS S3 bucket.
	 *
	 * @param fileStream - The readable stream of the file to be uploaded.
	 * @param bucket - The target S3 bucket name.
	 * @param key - The key under which the file will be stored in the S3 bucket.
	 * @param name - The name of the file.
	 * @param contentType - The content type of the file.
	 * @returns {Promise<string>} The URL of the uploaded file on S3.
	 * @throws {DataError} If there is an error during the upload.
	 */
	async uploadLocalFileToS3(fileStream: any, bucket: string, key: string, name: string, 
		contentType: string, acl: string): Promise<string> {
		try {
			const keyName = this._keyName(key, name);
			const paramObj: PutObjectCommandInput = {
				Bucket: bucket,
				Body: fileStream,
				Key: keyName,
				ContentType: contentType,
				// ACL: acl,
				ContentDisposition: 'attachment',
			};

			const command = new PutObjectCommand(paramObj);
			const uploadFileResponse = await EXPRS.awsS3Obj.send(command);
			if (uploadFileResponse.$metadata.httpStatusCode === 200) {
				console.log(uploadFileResponse);
				return this._returnObjectURL(keyName);
			} else {
				throw new DataError(`There is an error while uploading.`);
			}
		} catch (error) {
			throw new DataError(`There is an error while uploading: ${error}`);
		}
	}

	private _returnObjectURL(key: string): string {
		return `https://${this.getAppObj().globalVariables.EXPRS_CDN_BUCKET}.s3.ap-south-1.amazonaws.com/${key}`;
	}

	private _keyName(key: string, originalname: string): string {
		let originalName = originalname.replace(/\s/g, '-');
		return `${key}/${originalName}`;
	}

	private _deleteFile(file: Express.Multer.File) {
		fs.unlink(file.path, (error) => {
			if (error) {
				console.error(`Error while deleting file`, error);
			}
		});
	}
}
