import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('Change eventId')
	.open(`GET /events/${env.eventId}`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals(200);
		context.assert(context.response.jsonBody.$.data.id).not.equals(env.eventId);
		
		// TO DO:
		// variables.set("eventId", 11708);

	})