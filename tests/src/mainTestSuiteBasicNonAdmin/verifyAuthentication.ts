import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Verify Authentication')
	.setBearerToken(env.tokenVal)
	.open(`GET /auth`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody).exists();
		
	})