# Introduction to Data Storage in Web Applications

## What is Data Storage?

Data storage is how we save information for later use in our applications. It's like having different types of notebooks for different purposes:

- **JSON Files** are like a shared class notebook that everyone can see and use
- **Sessions** are like personal notepads that each student gets during class
- **LocalStorage** is like your own personal notebook that stays in your desk

## Why Do We Need Different Types of Storage?

Different kinds of information need to be stored in different ways:

| Storage Type | Best For | Example |
|-------------|----------|---------|
| JSON Files | Data that everyone needs to access | List of game characters |
| Sessions | Temporary user-specific data | Currently logged-in user's profile |
| LocalStorage | Persistent user preferences | Game settings like sound volume |

## The Web's Stateless Nature

Web applications work through a series of requests and responses:

1. Your browser makes a request to a website
2. The server sends back a response
3. The connection ends completely

Unlike desktop applications that run continuously, web applications need ways to "remember" things between these separate requests. That's where our different storage methods come in!

## Data Persistence Spectrum

Our three storage methods exist on a spectrum of persistence:

- **Most Persistent**: JSON files (stored on the server until deleted)
- **Medium Persistence**: LocalStorage (stored in the browser until cleared)
- **Least Persistent**: Sessions (temporary, expires after inactivity)

## Client-Side vs. Server-Side Storage

Another important distinction is where the data is stored:

- **Server-side storage** (JSON files, Sessions): Data stored on the web server
- **Client-side storage** (LocalStorage): Data stored in the user's browser

## Our Demo Application

In our Storage Explorer demo, you'll see all three storage types in action:

1. Creating game characters stored in JSON files
2. Managing a game profile in the server session
3. Saving game settings in the browser's localStorage

The next sections will explain each storage method in detail!