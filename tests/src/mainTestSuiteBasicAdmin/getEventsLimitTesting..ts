import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events - limit testing.')
	.open(`GET /events?limit=${env.maxLimit}&sort=-id`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals(200);
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody).contains("data");
		
		// TO DO:
		// var json = JSON.parse(response.body);
		 //var counter = 0;
		 //while (counter < json.data.length) 
		 //{
		 //    assert.isNumber(json.data[counter].id, 'id');
		 //    counter += 1;
		 //}
		 //assert.equal(counter, variables.get("maxLimit"), '== number of events called');

	})