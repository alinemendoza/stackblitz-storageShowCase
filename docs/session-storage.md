# Session Storage

## What are Sessions?

A session is a way for a web server to remember information about a specific user during their visit to a website. Think of it like getting a wristband at an amusement park - it identifies you and keeps track of which rides you've been on.

Sessions are temporary and typically last only as long as your browser is open, or until a set time period (like an hour) has passed without any activity.

## How Sessions Work

1. **Creating a Session**: When you first visit a website, the server creates a unique session ID for you
2. **Storing the ID**: This ID is stored as a cookie in your browser
3. **Remembering You**: When you make another request to the website, your browser sends the cookie with your session ID
4. **Accessing Your Data**: The server uses this ID to retrieve your session data from its memory

## How Sessions are Used in Our Application

In our Storage Explorer app, we use sessions to store your game profile. Here's what happens:

1. When you first visit the site, a new empty session is created for you
2. When you save a game profile, it's stored in your session on the server
3. When you refresh the page, the server retrieves your profile from your session
4. If you don't visit the site for a while (typically an hour), your session expires and your profile is lost

## Behind the Scenes: Server Code

Here's a simplified version of how our server handles sessions:

```javascript
// Set up session middleware in Express
app.use(
  session({
    secret: 'game-profile-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // Session expires after 1 hour
  })
);

// API endpoint to save a game profile
app.post('/api/profile', (req, res) => {
  // Get the profile data from the request
  const profile = req.body;
  
  // Store it in the user's session
  req.session.gameProfile = profile;
  
  // Send back a success response
  res.json({ success: true, profile });
});

// API endpoint to get the saved game profile
app.get('/api/profile', (req, res) => {
  // Get the profile from the session (if it exists)
  const profile = req.session.gameProfile || null;
  
  // Send the profile back to the client
  res.json({ profile });
});
```

## Advantages of Sessions

1. **Security**: Session data is stored on the server, not in the browser
2. **User-specific**: Each visitor gets their own separate session
3. **Temporary**: Data is automatically cleared after inactivity
4. **Size**: Can store more data than cookies (which have size limits)

## Limitations of Sessions

1. **Server Memory**: Sessions use server memory, which can be a problem with many users
2. **Stateful**: Makes your application harder to scale across multiple servers
3. **Expiration**: Data is lost when the session expires
4. **Server-side only**: Like JSON files, session data lives on the server

## When to Use Sessions

Sessions are best for:
- User-specific temporary data
- Information that needs to be secure
- Data that should expire after inactivity
- User authentication and login state

## Session Storage in Our Application

In our Storage Explorer demo, the Sessions tab lets you:
1. Create or update your game profile (username, level, experience)
2. See your current profile data stored in the session
3. Observe how your profile persists between page refreshes

Remember that if you close your browser or don't use the application for an hour, your session will expire and your profile will be lost. This is different from localStorage, which persists even after closing the browser.