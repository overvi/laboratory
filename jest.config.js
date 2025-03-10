module.exports = {
  testEnvironment: "jest-environment-jsdom",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: ["**/?(*.)+(test).js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
