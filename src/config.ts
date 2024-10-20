const config = {
    databaseUrl: process.env.DATABASE_URL!,
    memcachedHost: process.env.MEMCACHED_HOST || 'localhost',
    memcachedPort: parseInt(process.env.MEMCACHED_PORT || '11211', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
