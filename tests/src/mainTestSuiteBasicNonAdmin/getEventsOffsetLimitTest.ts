import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events - Offset & Limit test')
	.open(`GET /events?offset=${env.listOffset}&limit=6`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("200");
		context.assert(context.response.jsonBody.$.data[0].id).not.equals(env.eventId);
		
	})