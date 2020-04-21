import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('POST /streams/streamId/tokens - Should create a new token for the stream')
	.setBearerToken(env.tokenVal)
	.open(`POST /streams/${env.streamId}/tokens`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		
	})