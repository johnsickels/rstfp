import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Returns Stream targets of Stream')
	.setBearerToken(env.tokenVal)
	.open(`GET /streams/${env.streamId}/stream-targets`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		
	})