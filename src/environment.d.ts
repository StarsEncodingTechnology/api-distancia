declare global {
  // configurações das env do sistema
    namespace NodeJS {
      interface ProcessEnv {
        LOGIN_DB: string;
        SENHA_DB: string;
        CONFIG_DB: string;
        NODE_ENV: 'development' | 'production';
        APITOKEN: string;
      }
    }
  }
  
  export {}