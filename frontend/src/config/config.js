const config = {
    development: {
      apiUrl: 'http://localhost:3000', 
    },
    production: {
      apiUrl: 'http://localhost:3000', 
    },
    test: {
      apiUrl: 'http://localhost:4000', 
    },
  };
  
  const getConfig = () => {
    const env = process.env.REACT_APP_ENV || 'development';
    return config[env];
  };
  
  export default getConfig;