## Strategy

We store questions and regions in the database. Each region has its own cycle and cycle duration.
We provide a REST API to get the question for the user. The API will return the question based on the user's region and
the current cycle.
Through the API, we can also post the new questions and attach them to the region.
Questions are stored as a queue, when we attach a new question to the region, we either calculate the start of the
cycle (
previous cycle end) and its end (start + cycle duration), or write given start date.
When the user requests a question, first we check cache, if there is none, we check what questions is within the cycle
and return it to the user, saving the result to the memcached with TTL till duration ends.
If there are more than one question, we return the one which has the earliest end date.

e.g. from somewhere from admin panel we attach first question to the region with start day equal to next monday 7pm SGT.
Then when admin will attach next question, it will be calculated to start at next monday 7pm SGT + 7 days and so on.

### Pros

- Logic is simple and easy to implement
- Very fast response time
- We can easily scale the application by adding more instances of the app
- No CRON jobs needed

### Cons

- Not flexible when it comes to cycle change. If we need attached questions to change the cycle accordingly, we need to
  consider other options, or update implementation (for example recalculate all questions for the region on cycle
  duration change)
- Current schema does not support multiple questions per cycle. If we need to support this, we need to change the logic
  accordingly
- Only string question content is supported. If we need to support different types of questions, we need to add a type
  column and content column to the question table
- We don't consider the case when there is no questions in pool for the region. Suppose data is added on some weekly
  basis

## Scalability

Fastify instance can be scaled horizontally by running multiple instances. Then we can use a load balancer to distribute
the load between the servers.
We can also use a region-based load balancer, like nginx geoip, to distribute the load based on the user's region.


## Start the project
to start the project locally, you need to have docker and docker-compose installed on your machine.

First, you need to create a `.env` file in the root of the project. You can copy the `.env.example` file and fill in the
variables.
```shell
cp .env.example .env
```

Then you can run the following command:

```shell
 docker-compose -f docker-compose.yml -f docker-compose.app.yml up -d
```
This will start both the app and the database. The app will be available on `http://localhost`

to seed database with some data, you can run the following command:

```shell
docker-compose -f docker-compose.yml -f docker-compose.app.yml exec app npm run seed
```
