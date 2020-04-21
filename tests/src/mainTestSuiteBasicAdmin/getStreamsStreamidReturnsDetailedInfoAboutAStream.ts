import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /streams/streamId - Returns detailed info about a stream')
	.open(`GET /streams/${env.streamId}`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals(200);
		context.assert(context.response.jsonBody).exists();
		context.assert(context.response.jsonBody.$.data.id).type.equals('number');
		context.assert(context.response.jsonBody.$.data.id).equals(env.streamId);
		context.assert(context.response.jsonBody.$.data.eventId).type.equals('number');
		context.assert(context.response.jsonBody.$.data.eventId).equals(env.eventId);
		
	})