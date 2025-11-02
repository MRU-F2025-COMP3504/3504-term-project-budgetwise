export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFiles: ["dotenv/config"],
};
