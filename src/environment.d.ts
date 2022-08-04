declare global {
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
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}