import { Flagpole } from 'flagpole';
import * as env from '../../../env';

const suite = Flagpole.suite('This suite was generated from the RSTFPG');

suite
	.json('GET /events - Negative testing randomized alphanumeric eventIds')
	.open(`GET /events/${env.random_string(10)}`)
	.next((context)=>{
		context.assert(context.response.statusCode).equals("400");
		
	})