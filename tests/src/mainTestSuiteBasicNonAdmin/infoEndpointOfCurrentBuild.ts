import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Info Endpoint of Current build')
	.setBearerToken(env.tokenVal)
	.open(`GET /info`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody.$.data).exists();
		
	})