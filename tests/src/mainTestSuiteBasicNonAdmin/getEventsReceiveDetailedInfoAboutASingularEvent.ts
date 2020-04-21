import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events - Receive detailed info about a singular event')
	.open(`GET /events/${env.eventId}?fields=id,name`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals(200);
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody.$.data.id).type.equals('number');
		context.assert(context.response.jsonBody.$.data.id).equals(env.eventId);
		
	})