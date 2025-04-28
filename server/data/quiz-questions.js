/**
 * Quiz questions about web storage methods
 * Each question has:
 * - question: The question text
 * - options: Array of possible answers
 * - correctAnswer: Index of the correct answer in the options array
 * - explanation: Explanation of the correct answer
 */
export const quizQuestions = [
  {
    question: "Which storage method persists even after the browser is closed?",
    options: [
      "Session Storage",
      "Cookies",
      "Local Storage",
      "All of the above"
    ],
    correctAnswer: 2,
    explanation: "LocalStorage data persists until explicitly cleared, even after the browser is closed."
  },
  {
    question: "Where is session data typically stored?",
    options: [
      "In the browser only",
      "On the server",
      "In a database",
      "In the URL"
    ],
    correctAnswer: 1,
    explanation: "Session data is typically stored on the server, with only a session ID stored in the browser."
  },
  {
    question: "What format is used for JSON data?",
    options: [
      "Key-value pairs",
      "XML format",
      "Plain text",
      "Binary format"
    ],
    correctAnswer: 0,
    explanation: "JSON data is stored as key-value pairs using a specific syntax with curly braces and colons."
  },
  {
    question: "What is unique about cookies compared to localStorage?",
    options: [
      "Cookies can store more data",
      "Cookies are sent with every HTTP request to the server",
      "Cookies can only be accessed via JavaScript",
      "Cookies never expire automatically"
    ],
    correctAnswer: 1,
    explanation: "Unlike localStorage, cookies are automatically sent with every HTTP request to the same domain, making them useful for server communications."
  },
  {
    question: "What's the main difference between localStorage and sessionStorage?",
    options: [
      "localStorage is more secure",
      "sessionStorage persists after the browser is closed",
      "localStorage can store more data",
      "sessionStorage is cleared when the page session ends"
    ],
    correctAnswer: 3,
    explanation: "sessionStorage is cleared when the page session ends (when the tab is closed), while localStorage persists."
  },
  {
    question: "What is the maximum size limit for a single cookie?",
    options: [
      "About 4KB",
      "About 50KB",
      "About 500KB",
      "About 5MB"
    ],
    correctAnswer: 0,
    explanation: "Cookies are limited to about 4KB in size, which is much smaller than localStorage's 5-10MB limit."
  },
  {
    question: "Why might a website use API caching with localStorage?",
    options: [
      "To make the website look better",
      "To reduce server load and improve performance",
      "To prevent users from accessing the data",
      "To collect more user information"
    ],
    correctAnswer: 1,
    explanation: "Caching API responses in localStorage reduces the number of network requests, improves performance, and helps stay within API rate limits."
  },
  {
    question: "What happens to session data when a user closes their browser?",
    options: [
      "It remains on the server forever",
      "It's immediately deleted",
      "It's typically deleted after a timeout period",
      "It's transferred to localStorage"
    ],
    correctAnswer: 2,
    explanation: "Session data typically remains on the server for a configured timeout period after the user's session ends, then it's deleted."
  },
  {
    question: "How can you make a cookie expire?",
    options: [
      "You can't - cookies always expire automatically after 24 hours",
      "Set the 'expires' or 'max-age' property to a past date or negative value",
      "Delete it from the Application tab in browser devtools",
      "Restart the browser"
    ],
    correctAnswer: 1,
    explanation: "To delete a cookie, you set its expiration date to a past date or set its max-age to a negative value. This tells the browser to remove it."
  },
  {
    question: "What's the maximum storage capacity typically available for localStorage?",
    options: [
      "1KB",
      "500KB",
      "5-10MB",
      "Unlimited"
    ],
    correctAnswer: 2,
    explanation: "LocalStorage typically has a limit of 5-10MB, though this varies between browsers."
  },
  {
    question: "What is an API?",
    options: [
      "A type of programming language",
      "A database system",
      "An interface that allows different software systems to communicate",
      "A security protocol"
    ],
    correctAnswer: 2,
    explanation: "API (Application Programming Interface) allows different software systems to communicate with each other by defining rules for interaction."
  },
  {
    question: "Which of these is NOT a valid JavaScript method for working with localStorage?",
    options: [
      "localStorage.getItem()",
      "localStorage.setItem()",
      "localStorage.removeItem()",
      "localStorage.updateItem()"
    ],
    correctAnswer: 3,
    explanation: "localStorage.updateItem() is not a valid method. To update an item, you would use setItem() with the same key."
  }
];

/**
 * Generates feedback based on quiz score
 * @param {number} score - The user's score
 * @param {number} total - The total possible score
 * @returns {string} - Feedback message
 */
export function getFeedback(score, total) {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return "Excellent! You've mastered web storage concepts!";
  } else if (percentage >= 70) {
    return "Great job! You have a good understanding of web storage methods.";
  } else if (percentage >= 50) {
    return "Good effort! Review the sections you missed to improve your knowledge.";
  } else {
    return "Keep learning! Try exploring each storage method again to build your understanding.";
  }
}