export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
  transformIgnorePatterns: [
    "/node_modules/(?!supertest)/",
  ],
  moduleFileExtensions: ['js', 'json', 'node']
};
