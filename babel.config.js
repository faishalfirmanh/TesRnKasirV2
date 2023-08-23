module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
   //untuk library .env
    "plugins": [
      ["module:react-native-dotenv", {
        "envName": "APP_ENV",
        "moduleName": "@env",
        "path": ".env"
      }]
    ]
};
