Communication: 

Whatsapp Group: Contact Member for invite

Shared Google Drive: https://drive.google.com/drive/folders/0AFkzdUwo_lwOUk9PVA

Members: <br>
Jasraj Dhaliwal <br>
Ben Harris-Eze Jr <br> 
Laurence Hono <br>
Sebastian Samaco <br>
Anmol Verma <br>

- SHARE WHICH USE CASE(S)/FEATURES ARE OPERATIONAL
- CLEAR INSTRUCTIONS ON HOW TO BUILD, TEST, AND RUN THE SYSTEM
    (APOORVE SHOULD BE ABLE TO BUILD OUR PROJECT)

## Performing tests
## Testing Guide

This project uses Jest for automated testing. Follow the steps below to run tests successfully.

---

### Prerequisites
Before running tests:
- Ensure your `.env` file is configured  
- Install project dependencies
```bash
npm install
```
> If you do not have the required environment variables, contact the members listed in the **Members** section of the README to get set up.
---
### Test Location
Place all test files inside the `__test__/` folder:
```
__test__/
 └── authenticateUser.test.js
```
---
### Running Tests
Run all tests:
```bash
npm test
```
Jest runs in watch mode, re-running tests automatically when files change.
---
### Running a Specific Test File
```bash
npm test -- __test__/yourTestFile.test.js
```
Example:
```bash
npm test -- __test__/authenticateUser.test.js
```
---
### Running a Specific Test by Name
```bash
npm test -- -t "test name"
```
Example:
```bash
npm test -- -t "authenticateUser returns user"
```
## Making a build

## Operation Use cases
### Use case 3: Scanning bank statements
the user needs to be loged in 
