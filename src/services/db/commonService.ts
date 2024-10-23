import { GlobalService } from '@AppServices/db/globalService';
import { Transaction, QueryTypes } from 'sequelize';


export class CommonService extends GlobalService {

    async getUser(user_id: number, transaction?: Transaction): Promise<any[]> {
        const cdnUrl = this.getAppObj().globalVariables.EXPRS_CDN_URL;

		let sqlQuery = `
		SELECT U.id, U.name, U.phone, U.email, 
		CASE 
		 WHEN CTI.image_url IS NOT NULL THEN CONCAT('${cdnUrl}', CTI.image_url) 
		 ELSE NULL
		END AS url , U.last_log_in
        FROM users as U
		LEFT JOIN ct_images CTI ON CTI.user_id = U.id
        WHERE U.id = ${user_id}`;

		try {
			const queryResult = await this.executeCustomQuery(sqlQuery, {
				replacements: [],
				type: QueryTypes.SELECT, // Specify the query type as SELECT
			}, transaction);
			
			return queryResult;
		} catch (error: any) {
			// Handle validation errors if needed
			throw new Error(`${error.message}`);
		}
	}

    async getList(user_id: number, transaction?: Transaction): Promise<any[]> {
        const cdnUrl = this.getAppObj().globalVariables.EXPRS_CDN_URL;

		let sqlQuery = `
		SELECT U.id, U.name, U.phone, U.email,R.id AS request_id, R.updated_at, CONCAT('${cdnUrl}', I.image_url) AS url 
        FROM requests as R
		LEFT JOIN users U ON (U.id = R.from_user_id OR U.id = R.to_user_id) AND U.id != ${user_id} 
		LEFT JOIN ct_images I on U.id = I.user_id
        WHERE R.status = 2 AND (R.from_user_id = ${user_id} OR R.to_user_id = ${user_id})`;

		try {
			const queryResult = await this.executeCustomQuery(sqlQuery, {
				replacements: [],
				type: QueryTypes.SELECT, // Specify the query type as SELECT
			}, transaction);
			
			return queryResult;
		} catch (error: any) {
			// Handle validation errors if needed
			throw new Error(`${error.message}`);
		}
	}

    async getChat(from_user: number,to_user: string,limit: number, offset: number, transaction?: Transaction): Promise<any[]> {

		let sqlQuery = `
		SELECT *, 
		CASE 
		WHEN C.from_user = ${from_user} THEN 0
		WHEN C.to_user = ${from_user} THEN 1
		END AS incoming
		FROM chats C
		WHERE (C.from_user = ${from_user} AND C.to_user = ${to_user}) OR (C.from_user = ${to_user} AND C.to_user = ${from_user})
		ORDER BY C.created_at DESC
		`;

		try {
			const queryResult = await this.executeCustomQuery(sqlQuery, {
				replacements: [],
				type: QueryTypes.SELECT, // Specify the query type as SELECT
			}, transaction);
			
			return queryResult;
		} catch (error: any) {
			// Handle validation errors if needed
			throw new Error(`${error.message}`);
		}
	}

}

