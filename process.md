Let’s assume you have N questions stored in a database, and each question needs to be assigned to a specific cycle.
Each cycle spans 1 week, after which a new question is assigned to the next cycle.

The question assignments are region-specific, meaning users in different regions receive different questions.
For example, users in Singapore get question X, while users in the US receive question Y.
All users in the same region will get the same question.

- database: questions table, region table, maybe one-to-many relationship region_questions table?
- Does question is just plain text? 
- If this feature is like stories with multiple types, maybe it should have type column and content column, so we can have different types of questions (e.g. multiple choice, open question, etc.)

The duration of each cycle is configurable and can vary (e.g., 1 day, 7 days, 14 days, 30 days).
- we can store the cycle configuration in the database, and update it when needed
- if we update the cycle configuration, do we need to update already assigned questions? Assume we do not need to update them

  Design & Implement: Build a question rotation system and design an efficient architecture to solve the problem. Consider any potential improvements to enhance the product.
- we can use a cron job to assign questions to users based on the cycle duration, or we can store the cycle range in the database.
- potential improvements: what if there will be not one, but many question per cycle?

- do we use API to get the questions for the user? Let's assume we do and we build REST API
- do we save answers?

Scalability Requirement:
The solution should be capable of handling 100k daily active users (DAU) and scale to support millions of global users, ensuring efficient question assignment and rotation based on region and cycle configuration.
- We can easily make many instances of node app, and use a load balancer to distribute the load between the servers 
- Also, we can use a region-based load balancer, nginx geoip maybe?
- Because we do know question rotation in advance, we can use a cache to store the questions for the user, and update the cache every cycle. For simplicity, we can use memcached or redis
