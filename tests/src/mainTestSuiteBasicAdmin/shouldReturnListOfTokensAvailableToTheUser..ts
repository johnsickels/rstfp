import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Should return list of tokens available to the user.')
	.setBearerToken(env.tokenVal)
	.open(`GET /tokens?userId=${env.userId}`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		
		// TO DO:
		// var json = JSON.parse(response.body);
		 //var counter = 0;
		 //while (counter < json.data.length) 
		 //{
		 //    assert.isString(json.data[counter].id, 'id');
		 //    counter += 1;
		 //}
		 //variables.set("numTokens", json.data.length);
		 //assert.equal(counter, json.data.length, '== number of tokens possesed.');
		 //
		 //if(counter > 0)
		 //    counter -= 1;
		 //
		 //if(json.data.length !== 0)
		 //    variables.set("tokenId", json.data[counter].id);

	})