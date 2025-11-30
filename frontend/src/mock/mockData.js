export const mockConversations = [
  {
    id: '1',
    title: 'Hello, how are you?',
    timestamp: new Date('2025-01-15T10:30:00'),
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Hello, how are you?',
        timestamp: new Date('2025-01-15T10:30:00')
      },
      {
        id: 'm2',
        role: 'assistant',
        content: "Hello! I'm doing well, thank you for asking. How can I assist you today?",
        timestamp: new Date('2025-01-15T10:30:05')
      }
    ]
  },
  {
    id: '2',
    title: 'Explain React hooks',
    timestamp: new Date('2025-01-14T15:20:00'),
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'Can you explain React hooks?',
        timestamp: new Date('2025-01-14T15:20:00')
      },
      {
        id: 'm4',
        role: 'assistant',
        content: `React Hooks are functions that let you use state and other React features in functional components. Here are the most common ones:

**useState** - Lets you add state to functional components:
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

**useEffect** - Lets you perform side effects:
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

**useContext** - Lets you subscribe to React context without nesting.

Hooks make it easier to reuse stateful logic and organize code by feature rather than lifecycle methods.`,
        timestamp: new Date('2025-01-14T15:20:10')
      }
    ]
  },
  {
    id: '3',
    title: 'Python list comprehension',
    timestamp: new Date('2025-01-13T09:15:00'),
    messages: [
      {
        id: 'm5',
        role: 'user',
        content: 'Show me examples of Python list comprehension',
        timestamp: new Date('2025-01-13T09:15:00')
      },
      {
        id: 'm6',
        role: 'assistant',
        content: `Here are some Python list comprehension examples:

**Basic example:**
\`\`\`python
# Create a list of squares
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
\`\`\`

**With condition:**
\`\`\`python
# Even numbers only
evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

**Nested comprehension:**
\`\`\`python
# Flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
print(flat)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
\`\`\``,
        timestamp: new Date('2025-01-13T09:15:08')
      }
    ]
  }
];

export const saveMockConversation = (conversation) => {
  const saved = localStorage.getItem('manugpt_conversations');
  const conversations = saved ? JSON.parse(saved) : [];
  conversations.unshift(conversation);
  localStorage.setItem('manugpt_conversations', JSON.stringify(conversations));
  return conversation;
};

export const getMockConversations = () => {
  const saved = localStorage.getItem('manugpt_conversations');
  return saved ? JSON.parse(saved) : mockConversations;
};

export const getMockConversation = (id) => {
  const conversations = getMockConversations();
  return conversations.find(c => c.id === id);
};

export const deleteMockConversation = (id) => {
  const conversations = getMockConversations();
  const filtered = conversations.filter(c => c.id !== id);
  localStorage.setItem('manugpt_conversations', JSON.stringify(filtered));
  return filtered;
};