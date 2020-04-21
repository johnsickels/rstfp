import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Signed IP Specific Token Request')
	.setBearerToken(env.tokenVal)
	.setJsonBody({
"ip":"111.22.22.22"
})
	.open(`POST /streams/${env.streamId}/tokens`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody.$.data.token).exists();
		context.assert(context.response.jsonBody.$.data.token.ip).equals("111.22.22.22");
		
	})