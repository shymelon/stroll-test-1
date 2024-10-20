declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            DATABASE_URL: string;
            MEMCACHED_URL: string;
        }
    }
}

export {}
