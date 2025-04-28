# Practice Exercises and Activities

These exercises will help 9th-grade students better understand the different storage methods in web applications. Each activity focuses on one specific storage type with increasing levels of difficulty.

## JSON File Storage Exercises

### 1. Basic: Reading Character Stats

**Task:** Open the app, go to the JSON Files tab, and answer these questions:
- How many characters are currently stored in the JSON file?
- What are their names and classes?
- What is the highest level character?

### 2. Intermediate: Creating a New Character

**Task:** Create a new character with these steps:
1. Go to the JSON Files tab
2. Fill out the form with a new character:
   - Name: (your own creative name)
   - Class: Choose from the dropdown
   - Level: Set a number between 1-10
3. Click Create Character
4. Verify your character appears in the list

### 3. Advanced: JSON Structure Analysis

**Task:** Use your knowledge of JSON to answer these questions:
1. How would you represent a character with multiple abilities in JSON format?
2. How would you add "inventory" items to each character?
3. Design a JSON structure that could store a complete game world with characters, items, and locations.

## Session Storage Exercises

### 1. Basic: Session Observation

**Task:** Observe session behavior with these steps:
1. Go to the Sessions tab
2. Create a game profile with your information
3. Refresh the page
4. Notice if your profile information persists
5. Open the application in a new browser (or in private/incognito mode)
6. Check if your profile is still there in the new browser window

### 2. Intermediate: Session Expiration Test

**Task:** Test session expiration:
1. Create a game profile in the Sessions tab
2. Note the value in the profile
3. Wait for the session timeout period (typically 60 minutes, but may be set shorter for demonstration)
4. Alternatively, ask your teacher how to clear session cookies
5. Refresh the page
6. Observe if your profile is still available

### 3. Advanced: Session vs. LocalStorage Comparison

**Task:** Compare behavior between session and localStorage:
1. Create a profile in the Sessions tab
2. Create settings in the LocalStorage tab
3. Close the browser completely
4. Reopen the browser and go back to the application
5. Check which data persisted and which didn't
6. Explain why they behaved differently

## LocalStorage Exercises

### 1. Basic: Saving Game Settings

**Task:** Use localStorage to save game settings:
1. Go to the LocalStorage tab
2. Change the difficulty, sound and music settings
3. Save the settings
4. Refresh the page
5. Verify your settings were saved

### 2. Intermediate: High Scores Table

**Task:** Create and manage high scores:
1. Add at least 3 different high scores with different player names and point values
2. Observe how they are sorted
3. Refresh the page and check if they persist
4. Try adding more than 5 scores and observe what happens
5. Clear the localStorage and observe the result

### 3. Advanced: LocalStorage Inspector

**Task:** Inspect localStorage directly:
1. Open your browser's Developer Tools (F12 or right-click → Inspect)
2. Navigate to the Application tab (Chrome) or Storage tab (Firefox)
3. Select "Local Storage" in the sidebar
4. Find the storage for the Storage Explorer application domain
5. Look at the raw data stored there
6. Try editing a value directly in the inspector
7. Refresh the page and see if your manual edit appears in the app

## Challenge Project: Create Your Own Storage Demo

**Task:** Design a simple web page or modification that demonstrates all three storage types.

Ideas:
1. A personal journal app that stores:
   - Shared notes in a JSON file
   - Current user information in sessions
   - Display preferences in localStorage

2. A classroom attendance system that stores:
   - Student roster in a JSON file
   - Today's attendance in sessions
   - Visual theme preferences in localStorage

3. A quiz application that stores:
   - Questions and answers in a JSON file
   - Current quiz progress in sessions
   - High scores and preferred settings in localStorage

## Group Discussion Questions

1. For each of our storage methods, what happens if:
   - The user clears their browser cookies?
   - The user switches to a different browser?
   - The user switches to a different computer?
   - The server restarts?

2. Which storage method would be best for:
   - Saving a half-filled out job application?
   - Remembering if a user prefers dark or light mode?
   - Storing a shared class calendar?
   - Keeping track of logged-in users?

3. Can you think of examples of websites you use that likely use:
   - JSON files for data storage?
   - Sessions for personalization?
   - LocalStorage for preferences?