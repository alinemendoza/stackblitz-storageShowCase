# Code Walkthrough: How Our Storage Explorer Works

This document will walk you through the key parts of our Storage Explorer application code, focusing on how each storage method is implemented.

## Project Structure

Our application is divided into two main parts:

1. **Server-side code** (in the `server` folder)
   - Handles JSON file storage
   - Manages sessions
   - Serves the application to browsers

2. **Client-side code** (in the `client` folder)
   - Provides the user interface
   - Handles localStorage
   - Communicates with the server

## JSON File Storage Implementation

### Server-Side (storage.ts)

```javascript
// Ensure the characters file exists
function ensureCharactersFile() {
  // Check if the file exists
  if (!fs.existsSync('./server/data/characters.json')) {
    // Create the directory if it doesn't exist
    if (!fs.existsSync('./server/data')) {
      fs.mkdirSync('./server/data', { recursive: true });
    }
    
    // Create the file with an empty array
    fs.writeFileSync('./server/data/characters.json', '[]', 'utf8');
  }
}

// Get all characters from the JSON file
async getCharacters(): Promise<Character[]> {
  ensureCharactersFile();
  
  // Read the file
  const data = await fs.readFile('./server/data/characters.json', 'utf8');
  
  // Parse the JSON string into an array of Character objects
  const characters: Character[] = JSON.parse(data);
  
  return characters;
}

// Create a new character in the JSON file
async createCharacter(character: InsertCharacter): Promise<Character> {
  const characters = await this.getCharacters();
  
  // Generate a unique ID
  const id = `char_${Date.now()}`;
  
  // Create the new character with the ID
  const newCharacter: Character = {
    id,
    ...character
  };
  
  // Add to array and save to file
  characters.push(newCharacter);
  await fs.writeFile(
    './server/data/characters.json',
    JSON.stringify(characters, null, 2),
    'utf8'
  );
  
  return newCharacter;
}
```

### Client-Side (JsonSection.tsx)

```javascript
// Fetch the list of characters from the server
const { data: charactersData, isLoading } = useQuery({
  queryKey: ['/api/characters'],
  refetchOnWindowFocus: false,
});

// Create a new character
const createCharacterMutation = useMutation({
  mutationFn: async (character: InsertCharacter) => {
    const response = await apiRequest('/api/characters', {
      method: 'POST',
      body: JSON.stringify(character),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
  // Update the cache after creating a character
  onSuccess: () => {
    // Show success message
    showToast('Character created successfully!', 'success');
    // Refresh the character list
    queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
    // Reset the form
    form.reset();
  },
  onError: (error) => {
    showToast(`Error creating character: ${error.message}`, 'error');
  },
});
```

## Session Storage Implementation

### Server-Side Setup (index.ts)

```javascript
// Set up session middleware
app.use(
  session({
    secret: 'game-profile-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 hour
  })
);

// Session API routes (routes.ts)
app.post('/api/profile', async (req, res) => {
  try {
    const profile = req.body;
    
    // Input validation
    const result = gameProfileSchema.safeParse(profile);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    
    // Mock user ID for demo purposes
    const userId = 1;
    
    // Save the profile to the session
    const savedProfile = await storage.saveGameProfile(userId, result.data);
    
    // Log session data for debugging
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    
    res.json({ profile: savedProfile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Storage implementation (storage.ts)
async saveGameProfile(userId: number, profile: GameProfile): Promise<GameProfile> {
  this.gameProfiles.set(userId, profile);
  return profile;
}

async getGameProfile(userId: number): Promise<GameProfile | undefined> {
  return this.gameProfiles.get(userId);
}
```

### Client-Side (SessionSection.tsx)

```javascript
// Fetch the current profile from the session
const { data: profileData, isLoading } = useQuery({
  queryKey: ['/api/profile'],
  refetchOnWindowFocus: false,
});

// Update the profile in the session
const updateProfileMutation = useMutation({
  mutationFn: async (profile: GameProfile) => {
    const response = await apiRequest('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
  onSuccess: () => {
    showToast('Profile saved successfully!', 'success');
    queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
    form.reset();
  },
  onError: (error) => {
    showToast(`Error saving profile: ${error.message}`, 'error');
  },
});
```

## LocalStorage Implementation

LocalStorage is handled entirely on the client side:

```javascript
// Helper functions for working with localStorage
export const storage = {
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  },
  
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return fallback;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }
};

// Using localStorage in the LocalStorageSection component
function LocalStorageSection({ showToast }: LocalStorageSectionProps) {
  // Initial state from localStorage
  const [settings, setSettings] = useState<GameSettings>(() => 
    storage.get('gameSettings', {
      difficulty: 'medium',
      soundEnabled: true,
      musicEnabled: true
    })
  );
  
  // Save settings to localStorage
  const saveSettings = (newSettings: GameSettings) => {
    storage.set('gameSettings', newSettings);
    setSettings(newSettings);
    showToast('Settings saved to localStorage!', 'success');
  };
  
  // Add a high score
  const addHighScore = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Create the new score
    const newScore: HighScore = {
      player: playerName,
      score: parseInt(score),
      date: new Date().toISOString()
    };
    
    // Get current high scores
    const currentScores = storage.get<HighScore[]>('highScores', []);
    
    // Add new score and sort
    const updatedScores = [...currentScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep only top 5
    
    // Save back to localStorage
    storage.set('highScores', updatedScores);
    
    // Update state and show message
    setHighScores(updatedScores);
    showToast('High score added!', 'success');
    
    // Reset form
    setPlayerName('');
    setScore('');
  };
  
  // Clear all localStorage data
  const clearLocalStorage = () => {
    storage.remove('gameSettings');
    storage.remove('highScores');
    
    // Reset state
    setSettings({
      difficulty: 'medium',
      soundEnabled: true,
      musicEnabled: true
    });
    setHighScores([]);
    
    showToast('LocalStorage data cleared!', 'warning');
  };
  
  // ...rest of component code
}
```

## How It All Works Together

1. When you visit the application:
   - The server reads the characters from the JSON file
   - A new session is created for you if you don't have one
   - The client checks localStorage for any saved settings

2. When you interact with the JSON tab:
   - The client sends requests to the server to create or delete characters
   - The server updates the JSON file and sends back the new data

3. When you interact with the Session tab:
   - The client sends your profile data to the server
   - The server stores it in your session and sends it back when you reload

4. When you interact with the LocalStorage tab:
   - The client stores your settings directly in the browser's localStorage
   - No server communication is needed for this storage method

This architecture demonstrates the different roles and use cases for each storage method!