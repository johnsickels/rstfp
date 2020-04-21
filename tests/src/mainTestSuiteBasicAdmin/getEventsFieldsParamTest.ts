import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events - fields param test')
	.open(`GET /events?limit=${env.minLimit}&fields=id,name&sort=-id`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals(200);
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody.$.data[0].id).equals(env.eventId);
		
		// TO DO:
		// var json = JSON.parse(response.body);
		 //var counter = 0;
		 //while (counter < json.data.length) 
		 //{
		 //    assert.isNumber(json.data[counter].id, 'id');
		 //    assert.isString(json.data[counter].name, 'name');
		 //    
		 //    counter += 1;
		 //}
		 //assert.equal(counter, variables.get("minLimit"), '== number of events called');

	})