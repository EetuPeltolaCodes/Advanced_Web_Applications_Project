# Advanced Web Applications Project

This is the documentation for the project. In this project the goal was to make a tinder like system where users can like each other and when a match is found the users can chat with each other. The project can be run by going to the folder: Advanced_Web_Applications_Project and running command: npm run dev

Example:

```
cd Advanced_Web_Applications_Project
npm run dev
```

**Notice that you need to run: "npm install" in the server, client and project folders.**

Backend uses port 5000 and frontend uses port 3000 also mongoDB is connected to "mongodb://localhost:27017/project".

## Techonology choices

Technologies I have used in my project include e.g. Visual Studio Code and React.js. In this section I will validate my technology choices.

#### Visual Studio Code

I have used visual studio code for the whole course so this was easy choice, when choosing the code editor for this project.

#### React.js

For the frontend of this project I wanted to use a frontside framework. During the course I used React.js, so I wanted to use a familiar framework and chose React.js.

#### Materialize.css

The design of this project needed to be usable on the mobile and desktop, so I wanted to use some outside design system. This would make the user interface nicer and also make the usage on the mobile easier to implement. I have also used Materialize.css during the course, so it was the obvious choice.

#### MongoDB

In the project there needed to be database for the users and other information, so I needed to choose a database to store the data. MongoDB was used during the course and for that reason I wanted to use it in the project also. In the database there are users, messages and chats. Users are connected to other users in likes and matches lists. Messages are connencted to chat by the chat_id and to two users sentBy and receivedBy. Chats are connected to users: user1 and user2 and to messages in the messages list.

#### Passport.js

The system needed an authentication and during the course we have used JWT and session based authentication like Passport.js. I chose passport.js, because if I use it I could implement login with other accounts like Google in the future.

#### Multer

For the image storing I used multer, because it was the only way I knew how to do the image storing.

#### Express

I wanted to generate a basic backend server using express, so I didn't have to code it myself.

#### Proxy

I needed a way to connect my frontend and backend, so I used proxy to help with the API calls. I had to implement the proxy middleware manually, because the function didn't work.

## User manual

In this section is explained all the features the user can use.

#### Homepage

When the user first opens the homepage there is links to the registeration page and login page. User can open the homepage even if the user is already logged in.

### Nonauthenticated users

These features are only for nonauthenticated users authenticated users cannot access these sites, they are always send to the userpage when trying to access these sites.

#### Register

User who isn't logged in can access the register page where the user can register theirself in the database. If the user gives invalid credentials user gets an error message in the screen. There is also links to the homepage and login page.

#### Login

Like in the register page only users who hasn't logged in can access this site. User can login by giving the correct email and password combo, also the user can select the "Remember Me", when the user is logged in for a week otherwise only for an hour. If the user gives invalid credentials user gets an error message in the screen. There is also links to the homepage and register page.

### Authenticated users

These features are only for authenticated users nonauthenticated users cannot access these sites, they are always send to the homepage when trying to access these sites. All of the following websites have header where there is icon sortcuts to these pages e.g. userpage shortcut is behind the profile icon. All these pages are form of http://localhost:3000/:user_id.

#### Userpage

Userpage opens automatically when user is succesfully logged in. Userpage opens also when authenticated user is trying to access login or register page. In userpage the user can see and change their image and description text. The image is changes by pressing the change picture button and choosing the wanted image from your device. The text is changed by pressing the edit button then by writing the desired text and submitting the user can also cancel this action by pressing cancel.

#### Browsepage

Browsepage opens when the search icon in the header is pressed. In this page the user can see a random user that they haven't liked already. They are able to see the other user's image and description. They can either like or dislike the other user. If the user has liked all the users in the database there will be a message about it.

#### Matchpage

Matchpage opens when the chat icon in the header is pressed. In this page the user can see all the matches in the list. If there are more than 5 users the matches are in multiple pages and the user can change these pages by pressing the arrows at the beginning and at the end of the list. Below this list is the chat. By pressing one of the matches the chat between these two users appear. In the chat the logged in user's messages are on the right by name You and the other user's on the left by their name. In the chat the user can send new messages by writing in the textarea and then send the message to the other user. The user has to reload the page to see the new chats the other user has sent.

#### Logoutpage

Logoutpage opens when the logout icon in the header is pressed. User can logout by pressing the logout button then the user is sent to the homepage and logged out from the session.

## Feature implementation

In this section there is a list of the implemented features and the point expectation.

| Feature                                                                                                        | Points       |
| :------------------------------------------------------------------------------------------------------------- | ------------ |
| **Basic features with well written documentation**                                                      | 25           |
| **Utilization of a frontside framework, such as React, but you can also use Angular, Vue or some other** | 5            |
| **Use of a pager when there is more than 5 chats available available**                                  | 2            |
| **User profiles can have images**                                                                        | 3            |
| **Advanced user interface (Materialize and other css commands)**                                         | 3            |
| **Remember me function when logging in**                                                                 | 2            |
| ****If match is being found the UI gives option to start chat immediately****                      | 2            |
| **Total points**                                                                                         | **42** |
