import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events/eventId/streams - returns a list of streams associated with that eventId')
	.open(`GET /events/${env.eventId}/streams?isActive`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody).contains("data");
		
		// TO DO:
		// var json = JSON.parse(response.body);
		 //var counter = 0;
		 //while (counter < json.data.length) 
		 //{
		 //    assert.isNumber(json.data[counter].id, 'id');
		 //    assert.equal(json.data[counter].eventId, variables.get("eventId"), 'eventId');
		 //    counter += 1;
		 //}
		 //variables.set("streamId", json.data[0].id);

	})