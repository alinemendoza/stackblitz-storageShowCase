# JSON File Storage

## What is JSON?

JSON (JavaScript Object Notation) is a way to store data in a format that is easy for humans to read and write, and easy for computers to parse and generate. Think of it as a universal data notebook that both people and computers can understand.

A JSON file looks like this:
```json
{
  "characters": [
    {
      "id": "char_001",
      "name": "Zephyr",
      "class": "Mage",
      "level": 5
    },
    {
      "id": "char_002",
      "name": "Thorne",
      "class": "Warrior",
      "level": 7
    }
  ]
}
```

## How JSON Storage Works in Our Application

In our Storage Explorer app, we store game characters in a JSON file on the server. Here's how it works:

1. **Reading Data**: When you visit the characters page, the server reads the JSON file and sends the character data to your browser.
2. **Creating Data**: When you create a new character, the server:
   - Reads the current JSON file
   - Adds your new character to the data
   - Writes the updated data back to the file
3. **Deleting Data**: When you delete a character, the server:
   - Reads the current JSON file
   - Removes the character from the data
   - Writes the updated data back to the file

## Behind the Scenes: Server Code

Here's a simplified version of how our server handles JSON file storage:

```javascript
// Function to read all characters from the JSON file
async function getCharacters() {
  // Make sure the file exists
  ensureCharactersFile();
  
  // Read the file contents
  const data = await fs.readFile('./server/data/characters.json', 'utf8');
  
  // Parse the JSON string into a JavaScript object
  const characters = JSON.parse(data);
  
  return characters;
}

// Function to add a new character
async function createCharacter(character) {
  // Get all existing characters
  const characters = await getCharacters();
  
  // Generate a unique ID for the new character
  const id = `char_${Date.now()}`;
  
  // Create the new character with the ID
  const newCharacter = {
    id,
    ...character
  };
  
  // Add the new character to the array
  characters.push(newCharacter);
  
  // Write the updated array back to the file
  await fs.writeFile(
    './server/data/characters.json',
    JSON.stringify(characters, null, 2),
    'utf8'
  );
  
  return newCharacter;
}
```

## Advantages of JSON File Storage

1. **Simplicity**: JSON files are easy to create, read, and understand
2. **Portability**: The same file can be used across different systems
3. **Human-readable**: You can open and edit JSON files in any text editor
4. **Persistence**: Data stays saved until deliberately changed or deleted

## Limitations of JSON File Storage

1. **Not good for large data**: Reading/writing large JSON files is slow
2. **No concurrent access**: Problems can occur if multiple users try to update the same file at once
3. **Server-side only**: JSON files live on the server, not in the user's browser
4. **No built-in search**: To find specific data, you have to load the entire file and search through it

## When to Use JSON File Storage

JSON storage is best for:
- Small to medium-sized data collections
- Data that doesn't change very frequently
- Information that all users need to access
- Simple applications where a database would be overkill

## Viewing the JSON in Our Application

In our Storage Explorer demo, the JSON Files tab lets you:
1. See the current list of game characters
2. Add new characters to the collection
3. Delete characters from the collection

When you perform these actions, you're directly interacting with the JSON file on the server!