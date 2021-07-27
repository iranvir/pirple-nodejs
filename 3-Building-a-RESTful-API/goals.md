## Goals
1. RESTful API for an uptime monitoring application.
    - Listens
2. No NPM modules, no dependencies except Node.js library
3. Optimization in later sections of this course

## Behaviour
1. Allows users to enter URLs they want monitored, and receive alterts when
   those resources "go down" or "come back up".
2. Users can sign-in, sign-up, sign-out and check their settings
3. Up alerts via SMS, instead of email

## API Spec
1. API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT,
   DELETE and HEAD.
2. THE API allows a client to connect, then create a new users, then edit and
   delete that user.
3. The API allows a user to "sign in" which gives them a token that they can use
   for subsequent authenticated requests.
4. The API allows a user to "sign out" and invalidate that token.
5. The API allows a signed-in user to use their token to create a new "check",
   i.e, a given URL to check if it is up or down. User can also define what UP
   or DOWN means in this context.
6. Allows a signed-in user to edit or delete any of their checks. Limit the
   numbers of checks to 5.
7. In the background, workers perform all the "checks" at the appropriate times,
   and send alerts to the users when a check changes its state from "up" to
   "down", or vice versa. Once a minute!
