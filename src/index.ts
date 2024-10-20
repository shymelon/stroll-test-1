import dotenv from 'dotenv';
import Fastify from 'fastify';

import QuestionController from "./controllers/questionController";
import RegionController from "./controllers/regionController";

dotenv.config();

const fastify = Fastify();

fastify.get('/question', QuestionController.getQuestionByRegionCode);
fastify.post('/question', QuestionController.postQuestion);
fastify.post('/question/attach', QuestionController.attachQuestionToRegion);
fastify.put('/region', RegionController.updateRegion);


fastify.listen({port: 3000,host:'0.0.0.0'}, (err) => {
    if (err) throw err;
    console.log('Server is running on port 3000');
});
