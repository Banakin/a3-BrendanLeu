## Spaceship Battle Log

https://a3-brendanleu.brleu.com/

A battle log for space ships.

- This application built uppon [a2-BrendanLeu](https://github.com/Banakin/a2-BrendanLeu)
- I had a lot of difficulty combing through the changes needed to migrate to typescript and fighting with tsconfig, nodemon, and tsc, but I did it so I could continue developing with modern typed dev tooling.
- When building the application, I knew I wanted to use passport as I want to roll my own auth for a personal project of mine. I started with that, because that requires a lot of work throughout the application.
- This then requires the database, so I implemented MongoDB with Mongoose at this time. I achieved this and then with the time extension, decided to migrate the project to TypeScript for further development.
- After this I added the CSS library. I chose https://bulma.io/ because it is simple and works without libraries, focusing on functionality over looks.
- Lastly I deployed with docker and cleaned up the styles.
- The express middlewares I used include `connect-mongo`, `express-session`, `passport`, `enforce_files`.
  - `passport` is used for login and authentication management
  - `express-session` is used for browser authentication session management
  - `connect-mongo` is used in conjunction with express-session to store sessions in the mongo database
  - `enforce_files` a small middleware function that allows me to define static html pages that should or should not be behind an authentication wall. While not exactly necessary since the data apis are protected by auth, it was an easy fix for a much smoother user experience. The data api also takes a small middleware function to add auth requirements to the route.

### Technical Achievements
- OAuth Implementation using PassportJS. Includes both email/password and GitHub authentication flows.
- Deployed application using Vercel.
  - I personally use vercel and netlify for some of my websites. I chose vercel because they include easy database integration, good cli tooling, and offer a good free tier. Netlify or Cloudflare may have also worked but I knew vercel would get the job done.
  - Update: I had issues rendering index.html at the root. Index.html was fine but the root could not be fixed on vercel. Netlify had a process I did not feel like learning. I decided to deploy with docker using Github and a home server set up with an Nginx reverse proxy.
- Migrated server side codebase into TypeScript. (Maybe 5-10 points?)
- 100% Lighthouse

### Todo List
- [x] (style points) typescript

- [x] (15 Points - 15) ExpressJS Server
- [x] (10 Points - 25) "Results" that shows all **user** data
- [x] (15 Points - 40) Allow user to add/delete/edit their data
- [x] (5 points - 45) HTML Form Tags
  - textarea, input, select (radio or checkbox..?)
- [x] (15 Points - 60) MongoDB database
- [x] (10 Points - 70) Use CSS framework/template
  - https://bulma.io/
- [x] (10 points 80) Get 90% on lighthouse `Performance`, `Best Practices`, `Accessibility`, and `SEO`

- [x] (10 points - 90) OAuth authentication
  - PassportJS auth
  - Github auth
- [x] (5 points - 95) Other service than render
- [x] (5 points - 100 ) Get 100% on lighthouse

- [ ] (10 points) https://www.w3.org/WAI/ Accessibility
- [ ] (5 points) CRAP principles