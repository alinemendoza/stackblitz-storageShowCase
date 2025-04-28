import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the Express app
const app = express();

// Set up handlebars as the view engine
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up session
app.use(
    session({
        secret: 'storage-explorer-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3600000 } // 1 hour
    })
);

// Ensure the characters file exists
async function ensureCharactersFile() {
    try {
        await fs.access('./server/data/characters.json');
    } catch (error) {
        // Make sure the directory exists
        try {
            await fs.mkdir('./server/data', { recursive: true });
        } catch (dirError) {
            // Directory already exists, ignore
        }
        
        // Create empty characters array
        await fs.writeFile('./server/data/characters.json', '[]', 'utf8');
    }
}

// Routes
// Home page
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        activeHome: true
    });
});

// JSON File Storage page
app.get('/json', async (req, res) => {
    try {
        await ensureCharactersFile();
        const data = await fs.readFile('./server/data/characters.json', 'utf8');
        const characters = JSON.parse(data);
        
        res.render('json', {
            title: 'JSON Files',
            activeJson: true,
            characters,
            message: req.session.message,
            messageType: req.session.messageType
        });
        
        // Clear any flash messages
        delete req.session.message;
        delete req.session.messageType;
    } catch (error) {
        console.error('Error loading characters:', error);
        res.render('json', {
            title: 'JSON Files',
            activeJson: true,
            characters: [],
            message: 'Error loading characters',
            messageType: 'error'
        });
    }
});

// Create a new character
app.post('/json/create', async (req, res) => {
    try {
        const { name, class: characterClass, level } = req.body;
        
        // Basic validation
        if (!name || !characterClass || !level) {
            req.session.message = 'All fields are required';
            req.session.messageType = 'error';
            return res.redirect('/json');
        }
        
        // Parse level as a number
        const levelNum = parseInt(level);
        if (isNaN(levelNum) || levelNum < 1 || levelNum > 10) {
            req.session.message = 'Level must be a number between 1 and 10';
            req.session.messageType = 'error';
            return res.redirect('/json');
        }
        
        // Load current characters
        await ensureCharactersFile();
        const data = await fs.readFile('./server/data/characters.json', 'utf8');
        const characters = JSON.parse(data);
        
        // Create new character
        const newCharacter = {
            id: `char_${Date.now()}`,
            name,
            class: characterClass,
            level: levelNum
        };
        
        // Add to array and save
        characters.push(newCharacter);
        await fs.writeFile('./server/data/characters.json', JSON.stringify(characters, null, 2), 'utf8');
        
        // Flash message and redirect
        req.session.message = 'Character created successfully!';
        req.session.messageType = 'success';
        res.redirect('/json');
    } catch (error) {
        console.error('Error creating character:', error);
        req.session.message = 'Error creating character';
        req.session.messageType = 'error';
        res.redirect('/json');
    }
});

// Delete a character
app.post('/json/delete/:id', async (req, res) => {
    try {
        const characterId = req.params.id;
        
        // Load current characters
        await ensureCharactersFile();
        const data = await fs.readFile('./server/data/characters.json', 'utf8');
        const characters = JSON.parse(data);
        
        // Filter out the character to delete
        const filteredCharacters = characters.filter(character => character.id !== characterId);
        
        // If no character was removed, it wasn't found
        if (filteredCharacters.length === characters.length) {
            req.session.message = 'Character not found';
            req.session.messageType = 'error';
            return res.redirect('/json');
        }
        
        // Save the updated array
        await fs.writeFile('./server/data/characters.json', JSON.stringify(filteredCharacters, null, 2), 'utf8');
        
        // Flash message and redirect
        req.session.message = 'Character deleted successfully!';
        req.session.messageType = 'success';
        res.redirect('/json');
    } catch (error) {
        console.error('Error deleting character:', error);
        req.session.message = 'Error deleting character';
        req.session.messageType = 'error';
        res.redirect('/json');
    }
});

// Session Storage page
app.get('/session', (req, res) => {
    // Initialize profile if it doesn't exist
    if (!req.session.profile) {
        req.session.profile = null;
    }
    
    res.render('session', {
        title: 'Sessions',
        activeSession: true,
        profile: req.session.profile,
        sessionId: req.sessionID,
        message: req.session.message,
        messageType: req.session.messageType
    });
    
    // Clear any flash messages
    delete req.session.message;
    delete req.session.messageType;
});

// Save profile to session
app.post('/session/profile', (req, res) => {
    try {
        const { username, level, experience } = req.body;
        
        // Basic validation
        if (!username || !level || !experience) {
            req.session.message = 'All fields are required';
            req.session.messageType = 'error';
            return res.redirect('/session');
        }
        
        // Parse numeric values
        const levelNum = parseInt(level);
        const expNum = parseInt(experience);
        
        if (isNaN(levelNum) || levelNum < 1 || levelNum > 50) {
            req.session.message = 'Level must be a number between 1 and 50';
            req.session.messageType = 'error';
            return res.redirect('/session');
        }
        
        if (isNaN(expNum) || expNum < 0) {
            req.session.message = 'Experience must be a positive number';
            req.session.messageType = 'error';
            return res.redirect('/session');
        }
        
        // Create/update profile in session
        req.session.profile = {
            username,
            level: levelNum,
            experience: expNum,
            lastUpdated: new Date().toLocaleString()
        };
        
        // Log session data for debugging
        console.log('Session ID:', req.sessionID);
        console.log('Session Data:', req.session);
        
        // Flash message and redirect
        req.session.message = 'Profile saved to session!';
        req.session.messageType = 'success';
        res.redirect('/session');
    } catch (error) {
        console.error('Error saving profile:', error);
        req.session.message = 'Error saving profile';
        req.session.messageType = 'error';
        res.redirect('/session');
    }
});

// LocalStorage page
app.get('/local-storage', (req, res) => {
    res.render('localStorage', {
        title: 'LocalStorage',
        activeLocalStorage: true,
        pageScript: 'localStorage'
    });
});

// Documentation routes
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, '../docs/README.md'));
});

app.get('/docs/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, `../docs/${file}.md`));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});