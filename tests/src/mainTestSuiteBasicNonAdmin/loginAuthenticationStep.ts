import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Login & Authentication step')
	.setJsonBody( {"email":env.email,"password":env.password})
	.open(`POST https://staging-api.flosports.tv/api/tokens`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody).contains("token");
		
		// TO DO:
		// var tokenSchema = {
		 //  title: 'dataSchema',
		 //  type: 'object',
		 //  required: ['id', 'userId', 'userAgent', 'ip', 'streamId', 'issued', 'revoked', 'reason'],
		 //  properties: {
		 //    id: {
		 //      type: 'string'
		 //    },
		 //    userId: {
		 //      type: 'number'
		 //    },
		 //    userAgent: {
		 //      type: 'string'
		 //    },
		 //    ip: {
		 //        type: 'string'
		 //    },
		 //    streamId: {
		 //        type: 'number'
		 //    },
		 //    issued: {
		 //        type: 'number'
		 //    },
		 //    revoked: {
		 //        type: 'number'
		 //    },
		 //    reason: {
		 //        type: 'string'
		 //    }
		 //  }
		 //};
		 //
		 //chai.tv4.addSchema('dataSchema', tokenSchema);
		 //var schema = chai.tv4.getSchema('dataSchema');
		 //variables.set("tSchema", schema);

	})