import jsforce from 'jsforce'; // JS Connector (https://jsforce.github.io/)

// ENVIRONMENT
let conn: jsforce.Connection;
const SALESFORCE_LOGIN_SERVER: string = `${process.env.SALESFORCE_LOGIN_SERVER}`;
const SALESFORCE_LIGHTNING_URL: string = `${process.env.SALESFORCE_LIGHTNING_URL}`;
const SALESFORCE_EXPERIENCE_DOMAIN: string = `${process.env.SALESFORCE_EXPERIENCE_DOMAIN}`;
const SALESFORCE_USER_USERNAME: string = `${process.env.SALESFORCE_USER_USERNAME}`;
const SALESFORCE_USER_PASSWORD: string = `${process.env.SALESFORCE_USER_PASSWORD}`;
const SALESFORCE_USER_SECTOKEN: string = `${process.env.SALESFORCE_USER_SECTOKEN}`;
const SALESFORCE_CONNECTEDAPP_CLIENT_ID: string = `${process.env.SALESFORCE_CONNECTEDAPP_CLIENT_ID}`;
const SALESFORCE_CONNECTEDAPP_CLIENT_SECRET: string = `${process.env.SALESFORCE_CONNECTEDAPP_CLIENT_SECRET}`;
// ENVIRONMENT

export class Salesforce {
	static checkEnvironmentVariables(): void {
		let output: Boolean = true;

		output = output && (SALESFORCE_LOGIN_SERVER ? true : false);
		if (!output) throw new Error(`SALESFORCE_LOGIN_SERVER does not have a valid value`);

		output = output && (process.env.SALESFORCE_LIGHTNING_URL ? true : false);
		if (!output)
			throw new Error(`process.env.SALESFORCE_LIGHTNING_URL does not have a valid value`);

		output = output && (process.env.SALESFORCE_EXPERIENCE_DOMAIN ? true : false);
		if (!output)
			throw new Error(`process.env.SALESFORCE_EXPERIENCE_DOMAIN does not have a valid value`);

		output = output && (SALESFORCE_EXPERIENCE_DOMAIN ? true : false);
		if (!output) throw new Error(`SALESFORCE_EXPERIENCE_DOMAIN does not have a valid value`);

		output = output && (SALESFORCE_USER_USERNAME ? true : false);
		if (!output) throw new Error(`SALESFORCE_USER_USERNAME does not have a valid value`);

		output = output && (SALESFORCE_USER_PASSWORD ? true : false);
		if (!output) throw new Error(`SALESFORCE_USER_PASSWORD does not have a valid value`);

		output = output && (SALESFORCE_CONNECTEDAPP_CLIENT_ID ? true : false);
		if (!output) throw new Error(`SALESFORCE_CONNECTEDAPP_CLIENT_ID does not have a valid value`);

		output = output && (SALESFORCE_CONNECTEDAPP_CLIENT_SECRET ? true : false);
		if (!output)
			throw new Error(`SALESFORCE_CONNECTEDAPP_CLIENT_SECRET does not have a valid value`);
	}

	static userLogin_OAUTH(): Promise<any> {
		this.checkEnvironmentVariables();

		return new Promise((resolve, reject) => {
			//OAuth2 Flow
			conn = new jsforce.Connection({
				oauth2: {
					loginUrl: SALESFORCE_LOGIN_SERVER,
					clientId: SALESFORCE_CONNECTEDAPP_CLIENT_ID,
					clientSecret: SALESFORCE_CONNECTEDAPP_CLIENT_SECRET,
					redirectUri: 'https://login.salesforce.com/services/oauth2/callback'
				}
			});

			conn.login(
				SALESFORCE_USER_USERNAME,
				SALESFORCE_USER_PASSWORD + SALESFORCE_USER_SECTOKEN,
				(err, userInfo) => {
					if (err) {
						reject(err);
					} else {
						let res = {
							username: SALESFORCE_USER_USERNAME,
							accessToken: conn.accessToken,
							instanceUrl: conn.instanceUrl,
							userId: userInfo.id,
							orgId: userInfo.organizationId
						};

						console.log('Login Successful:');
						console.log(res);
						resolve(res);
					}
				}
			);
		});
	}
}
