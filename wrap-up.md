## Questions
- What was the expected time frame for this project?  I'll be honest I'm a little afraid I've misunderstood something 
because of the amount of code needed.  Regardless, I gave it my best.
- What was the expectation for the `A customer can withdraw no more than $400 in a single day` requirement?  After 
emailing I was told a transaction history wasn't a requirement.  Would a check in the browser be sufficient?
- Is it ok if I leave this code in my github account?


### Please provide instructions on how to run your project in a bulleted list below.
- Clone project, then get DB running. `init-db.sql` has been modified to add a new table.
- Using `nvm` or a node manager of your choice, switch to Node `18.19.0`.
- In the base directory (`atm_interview_challenge`) run `npm install` - This will install dependencies for the API.
- Within the `web` directory, run `npm install` again. This installs dependencies for the web component.
- To start the api, navigate to `nodeapi` under the base directory and run `node api.js`.
- In a separate terminal, navigate to `web` and run `npm run dev`.
- The ATM web page should be available at [http://localhost:5173/](http://localhost:5173/).

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
I really would've liked to add in testing.  But with how long it took me to get the project ready I figured the benefit 
of adding in testing wouldn't have outweighed the additional time.  I was looking at Jest for testing.

### If you were to continue building this out, what would you like to add next?
Probably a PIN system, or credit limits.  I'd also like to change out the PG package in the api.  It works fine but is 
turning int a nest of callbacks.  The promise version of PG might get around that.  If I were to continue expanding on 
this project I would put in something like [Redux](https://redux.js.org/) to help maintain state. Then also I'd
like to not have the nested web folder with its own `node_modules` / `package.json`.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
I mostly tried to approach this keeping in mind as many concerns as I'd have with a real ATM.  So for example things like 
validating input are done on both the front end and backend systems.  Also in cases like the withdrawal and deposit 
screens, I kept them as separate files even though they had a lot of similar code.  I chose that approach over one file 
to control both screens because then in the future we could further customize the screens if needed, and also so that 
there was less likelihood of bugs causing the user to have the wrong action performed on their account.

Thank you for your time and looking over this code!