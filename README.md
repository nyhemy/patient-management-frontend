# Final Project

## Description

Project meant to simulate a real-world client, and is meant to test trainee proficiency with tools learned throughout the cycle training program.

## Pre-Requisites

- React and VSCode

- Java and Intellij

- A Git GUI, preferably GitBash

- A web browser, preferably Chrome


## Using the App

### How to Use App

This app is meant to simulate a real world patient-encounter tracking application proof-of-concept for a healthcare clinic chain called Super Health Inc. This includes a backend which stores patient and encounter data, as well as a frontend ui that allows the viewing, curation, and modification of said data.

### Setup Backend

1. Download project backend by cloning it down from the git repo, if you have proper access it is available at the link below :
*https://gitlab.catalyt.es/training/cycleworkinggroups/nationwide/associates/nicolas-hemenway/final-project-backend*.

2. Open up the backend in Intellij. Run it using the Run arrow at the top right, or by right-clicking the **HotelApiApplication** file and selecting `Run HotelApiApplication....main()`.

3. You can also stop the backend by hitting the red square at the top right.

### Setup Frontend

1. Open up the frontend in VSCode. If you have to proper access rights it is available to be cloned down from the git repo below:
*https://gitlab.catalyt.es/training/cycleworkinggroups/nationwide/associates/nicolas-hemenway/final-project-frontend*.

2. Open your Git GUI and Navigate to the frontend app root repository.

3. Run `npm install`, this will install any dependencies the app needs to run.

4. Once all the dependencies have finished intalling run `npm start`. The app should automatically open in your browser.


## Testing and Linting

### Testing

1. Open Git GUI

2. Navigate to the frontend root directory

3. Run `npm test`

4. To test coverage run `npm test -- --coverage`

5. To test the entire project with coverage run `npm test -- --coverage --changedSince=master`

### Linting

Run `npm run lint`
