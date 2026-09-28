// ====================================================
// QUESTION BANK — 30 Fully Defined Questions
// ====================================================
const QUESTION_BANK = [
  // ── DATA STRUCTURES ──
  {
    id: 1, category: "Data Structures", difficulty: "easy",
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correct: 2,
    explanation: "Arrays provide constant-time O(1) access because elements are stored in contiguous memory and can be accessed directly via their index."
  },
  {
    id: 2, category: "Data Structures", difficulty: "easy",
    question: "Which data structure uses LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correct: 1,
    explanation: "A Stack follows LIFO — the last element pushed is the first one popped, like a stack of plates."
  },
  {
    id: 3, category: "Data Structures", difficulty: "medium",
    question: "What is the worst-case time complexity of inserting at the beginning of a singly linked list?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    correct: 1,
    explanation: "Inserting at the head of a singly linked list is O(1) — create a new node and point it to the current head.<code class='explanation-code'>function insertAtHead(head, val) {\n  const newNode = { val, next: head };\n  return newNode; // new head\n}</code>"
  },
  {
    id: 4, category: "Data Structures", difficulty: "medium",
    question: "Which data structure is best suited for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correct: 2,
    explanation: "A Heap (usually a binary heap) allows efficient O(log n) insertion and extraction of the min/max element, making it ideal for priority queues."
  },
  {
    id: 5, category: "Data Structures", difficulty: "hard",
    question: "What is the amortized time complexity of inserting into a hash table with separate chaining?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correct: 0,
    explanation: "With a good hash function and load factor management, hash table insertion is amortized O(1) on average."
  },
  // ── ALGORITHMS ──
  {
    id: 6, category: "Algorithms", difficulty: "easy",
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
    explanation: "Binary search halves the search space each iteration, resulting in O(log n) time complexity.<code class='explanation-code'>function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;\n  }\n  return -1;\n}</code>"
  },
  {
    id: 7, category: "Algorithms", difficulty: "easy",
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort — O(n²)", "Merge Sort — O(n log n)", "Selection Sort — O(n²)", "Insertion Sort — O(n²)"],
    correct: 1,
    explanation: "Merge Sort consistently achieves O(n log n) in all cases (best, average, worst), making it one of the most efficient comparison-based sorting algorithms."
  },
  {
    id: 8, category: "Algorithms", difficulty: "medium",
    question: "What technique does Quick Sort use?",
    options: ["Dynamic Programming", "Divide and Conquer", "Greedy", "Backtracking"],
    correct: 1,
    explanation: "Quick Sort uses the Divide and Conquer approach — it selects a pivot, partitions the array, and recursively sorts the sub-arrays.<code class='explanation-code'>function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}</code>"
  },
  {
    id: 9, category: "Algorithms", difficulty: "medium",
    question: "Which algorithm is used to find the shortest path in a weighted graph?",
    options: ["DFS", "BFS", "Dijkstra's Algorithm", "Prim's Algorithm"],
    correct: 2,
    explanation: "Dijkstra's algorithm finds the shortest path from a source to all vertices in a graph with non-negative edge weights."
  },
  {
    id: 10, category: "Algorithms", difficulty: "hard",
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
    explanation: "Merge Sort requires O(n) additional space for the temporary arrays used during the merge step."
  },
  // ── APTITUDE ──
  {
    id: 11, category: "Aptitude", difficulty: "easy",
    question: "If a train travels 60 km in 1 hour, how far will it travel in 3.5 hours at the same speed?",
    options: ["180 km", "200 km", "210 km", "240 km"],
    correct: 2,
    explanation: "Distance = Speed × Time = 60 × 3.5 = 210 km."
  },
  {
    id: 12, category: "Aptitude", difficulty: "easy",
    question: "What comes next in the series: 2, 6, 18, 54, ?",
    options: ["108", "162", "148", "72"],
    correct: 1,
    explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162."
  },
  {
    id: 13, category: "Aptitude", difficulty: "medium",
    question: "A can do a piece of work in 10 days, B in 15 days. Together, how many days will they take?",
    options: ["5 days", "6 days", "7 days", "8 days"],
    correct: 1,
    explanation: "A's rate = 1/10, B's rate = 1/15. Combined = 1/10 + 1/15 = 1/6. So together they finish in 6 days."
  },
  {
    id: 14, category: "Aptitude", difficulty: "medium",
    question: "If 5 machines can produce 5 widgets in 5 minutes, how long will 100 machines take to produce 100 widgets?",
    options: ["100 minutes", "5 minutes", "25 minutes", "1 minute"],
    correct: 1,
    explanation: "Each machine produces 1 widget in 5 minutes. So 100 machines produce 100 widgets in 5 minutes."
  },
  {
    id: 15, category: "Aptitude", difficulty: "hard",
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    correct: 1,
    explanation: "At 3:15, the minute hand is at 90°. The hour hand moves 0.5°/min, so at 3:15 it's at 90° + 7.5° = 97.5°. The angle between them is 7.5°."
  },
  // ── BEHAVIORAL ──
  {
    id: 16, category: "Behavioral", difficulty: "easy",
    question: "What is the most effective way to handle a disagreement with a teammate?",
    options: [
      "Ignore the disagreement",
      "Escalate immediately to management",
      "Have an open, respectful conversation to understand their perspective",
      "Insist your approach is correct"
    ],
    correct: 2,
    explanation: "Open communication and active listening are key to resolving conflicts constructively and maintaining team cohesion."
  },
  {
    id: 17, category: "Behavioral", difficulty: "easy",
    question: "When given a tight deadline, what should you prioritize?",
    options: [
      "Completing every feature perfectly",
      "Identifying critical tasks and delivering an MVP",
      "Working overtime without telling anyone",
      "Asking for a deadline extension immediately"
    ],
    correct: 1,
    explanation: "Prioritizing critical features and delivering an MVP ensures you meet the deadline while providing value. Communication about scope is key."
  },
  {
    id: 18, category: "Behavioral", difficulty: "medium",
    question: "How should you handle receiving negative feedback on your code review?",
    options: [
      "Defend every decision you made",
      "Accept all suggestions without question",
      "Consider the feedback objectively, ask questions, and improve",
      "Ignore the review"
    ],
    correct: 2,
    explanation: "Constructive feedback is a growth opportunity. Evaluate it objectively, ask clarifying questions, and use it to improve your skills."
  },
  {
    id: 19, category: "Behavioral", difficulty: "medium",
    question: "What demonstrates strong leadership in a team project?",
    options: [
      "Making all decisions yourself",
      "Delegating everything to others",
      "Facilitating collaboration and supporting team members' growth",
      "Taking credit for the team's work"
    ],
    correct: 2,
    explanation: "Strong leaders empower their team, facilitate collaboration, and support each member's growth while ensuring project goals are met."
  },
  {
    id: 20, category: "Behavioral", difficulty: "hard",
    question: "You discover a critical bug in production that was caused by your code. What do you do first?",
    options: [
      "Try to fix it secretly before anyone notices",
      "Immediately inform the team and start working on a fix",
      "Blame the testing process",
      "Wait to see if anyone notices"
    ],
    correct: 1,
    explanation: "Transparency and quick action are essential. Informing the team immediately allows for a coordinated response and faster resolution."
  },
  // ── FRONTEND ──
  {
    id: 21, category: "Frontend", difficulty: "easy",
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correct: 1,
    explanation: "CSS stands for Cascading Style Sheets. The 'Cascading' refers to how styles are applied in order of specificity and source."
  },
  {
    id: 22, category: "Frontend", difficulty: "easy",
    question: "Which HTML tag is used to define an unordered list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"],
    correct: 1,
    explanation: "The <ul> tag defines an unordered (bulleted) list. Each item inside is wrapped in an <li> tag."
  },
  {
    id: 23, category: "Frontend", difficulty: "medium",
    question: "What is the virtual DOM in React?",
    options: [
      "A direct copy of the browser DOM",
      "A lightweight JavaScript representation of the real DOM",
      "A database for storing components",
      "A CSS framework"
    ],
    correct: 1,
    explanation: "The virtual DOM is a lightweight JavaScript object that represents the real DOM. React uses it to batch updates and minimize expensive direct DOM manipulations."
  },
  {
    id: 24, category: "Frontend", difficulty: "medium",
    question: "Which CSS property is used to create a flexible box layout?",
    options: ["display: block", "display: flex", "display: grid", "display: inline"],
    correct: 1,
    explanation: "The 'display: flex' property creates a flex container, enabling powerful alignment and distribution of child elements."
  },
  {
    id: 25, category: "Frontend", difficulty: "hard",
    question: "What is the purpose of the useEffect hook in React?",
    options: [
      "To manage component state",
      "To perform side effects in function components",
      "To create new components",
      "To style components"
    ],
    correct: 1,
    explanation: "useEffect handles side effects like data fetching, subscriptions, or DOM manipulation in function components, replacing lifecycle methods."
  },
  // ── MORE ALGORITHMS ──
  {
    id: 26, category: "Algorithms", difficulty: "hard",
    question: "What is the time complexity of the Floyd-Warshall algorithm?",
    options: ["O(V²)", "O(V³)", "O(V × E)", "O(E log V)"],
    correct: 1,
    explanation: "Floyd-Warshall uses three nested loops over all vertices, resulting in O(V³) time complexity for finding all-pairs shortest paths."
  },
  {
    id: 27, category: "Data Structures", difficulty: "hard",
    question: "In a balanced BST with n nodes, what is the height?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(√n)"],
    correct: 1,
    explanation: "A balanced BST maintains O(log n) height by ensuring the tree doesn't degenerate into a linked list, enabling efficient search operations."
  },
  {
    id: 28, category: "Aptitude", difficulty: "hard",
    question: "A boat travels 20 km upstream in 5 hours and 20 km downstream in 2 hours. What is the speed of the stream?",
    options: ["2 km/h", "3 km/h", "4 km/h", "5 km/h"],
    correct: 1,
    explanation: "Upstream speed = 20/5 = 4 km/h. Downstream speed = 20/2 = 10 km/h. Stream speed = (10-4)/2 = 3 km/h."
  },
  {
    id: 29, category: "Frontend", difficulty: "hard",
    question: "What is tree shaking in JavaScript bundlers?",
    options: [
      "Removing unused DOM elements",
      "Eliminating dead/unused code from the final bundle",
      "Optimizing CSS selectors",
      "Reordering script tags"
    ],
    correct: 1,
    explanation: "Tree shaking is a dead code elimination technique used by bundlers like Webpack and Rollup to remove unused exports, reducing bundle size."
  },
  {
    id: 30, category: "Algorithms", difficulty: "easy",
    question: "What is the time complexity of linear search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 2,
    explanation: "Linear search checks each element one by one, resulting in O(n) time complexity in the worst case."
  },
  {
    id: 31, category: "Data Structures", difficulty: "medium",
    question: "What is the main advantage of a doubly linked list over a singly linked list?",
    options: ["Uses less memory", "Allows traversal in both directions", "Faster insertion at head", "Better cache performance"],
    correct: 1,
    explanation: "A doubly linked list has pointers to both next and previous nodes, allowing efficient traversal in both directions."
  },
  {
    id: 32, category: "Data Structures", difficulty: "easy",
    question: "Which data structure uses FIFO (First In, First Out) principle?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correct: 1,
    explanation: "A Queue follows FIFO — the first element enqueued is the first one dequeued, like a line at a store."
  },
  {
    id: 33, category: "Algorithms", difficulty: "medium",
    question: "Which algorithm is used to detect a cycle in a linked list?",
    options: ["Dijkstra's", "Floyd's Tortoise and Hare", "Kruskal's", "Bellman-Ford"],
    correct: 1,
    explanation: "Floyd's cycle detection uses two pointers (slow and fast). If they meet, a cycle exists in the linked list."
  },
  {
    id: 34, category: "Algorithms", difficulty: "hard",
    question: "What is the best-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correct: 1,
    explanation: "Quick Sort's best case is O(n log n), achieved when the pivot divides the array into two roughly equal halves each time."
  },
  {
    id: 35, category: "Frontend", difficulty: "medium",
    question: "What does the 'key' prop do in React lists?",
    options: ["Adds encryption", "Helps React identify which items changed", "Sorts the list", "Adds accessibility"],
    correct: 1,
    explanation: "Keys help React identify which items have changed, been added, or removed, enabling efficient re-rendering of lists."
  },
  {
    id: 36, category: "Frontend", difficulty: "easy",
    question: "Which CSS property controls the space between an element's content and its border?",
    options: ["margin", "padding", "border-spacing", "gap"],
    correct: 1,
    explanation: "Padding is the space between an element's content and its border, while margin is the space outside the border."
  },
  {
    id: 37, category: "Aptitude", difficulty: "easy",
    question: "If a shirt costs $40 after a 20% discount, what was the original price?",
    options: ["$48", "$50", "$52", "$60"],
    correct: 1,
    explanation: "If the discounted price is 80% of original: 40 = 0.8 × original. Original = 40/0.8 = $50."
  },
  {
    id: 38, category: "Aptitude", difficulty: "medium",
    question: "Three coins are tossed. What is the probability of getting exactly two heads?",
    options: ["1/4", "3/8", "1/2", "1/8"],
    correct: 1,
    explanation: "Total outcomes = 8. Favorable outcomes (HHT, HTH, THH) = 3. Probability = 3/8."
  },
  {
    id: 39, category: "Behavioral", difficulty: "medium",
    question: "What is the best approach when you realize you won't meet a project deadline?",
    options: ["Work silently and hope for the best", "Communicate early with stakeholders and propose solutions", "Blame other team members", "Reduce quality to meet the deadline"],
    correct: 1,
    explanation: "Early communication allows teams to adjust expectations, re-prioritize, or provide support — maintaining trust and transparency."
  },
  {
    id: 40, category: "Behavioral", difficulty: "hard",
    question: "A colleague takes credit for your idea in a meeting. What should you do?",
    options: ["Confront them publicly", "Let it go every time", "Address it privately and ensure proper attribution going forward", "Stop sharing ideas"],
    correct: 2,
    explanation: "Addressing it privately is professional and constructive. Document contributions and follow up to ensure fair attribution."
  },
  {
    id: 41, category: "Data Structures", difficulty: "hard",
    question: "What is the time complexity of searching in a trie for a word of length L?",
    options: ["O(n)", "O(L)", "O(log n)", "O(n log n)"],
    correct: 1,
    explanation: "In a trie, search time depends on the length L of the word, not the number of stored words — each character lookup is O(1)."
  },
  {
    id: 42, category: "Algorithms", difficulty: "medium",
    question: "What type of algorithm is BFS (Breadth-First Search)?",
    options: ["Greedy", "Dynamic Programming", "Graph Traversal", "Divide and Conquer"],
    correct: 2,
    explanation: "BFS is a graph traversal algorithm that explores all neighbors at the current depth before moving to the next level."
  },
  {
    id: 43, category: "Frontend", difficulty: "medium",
    question: "What is event delegation in JavaScript?",
    options: ["Assigning events to every child element", "Using a parent element to handle events for its children", "Removing events after they fire", "Creating custom events"],
    correct: 1,
    explanation: "Event delegation uses event bubbling — attaching a single listener to a parent to handle events from child elements efficiently."
  },
  {
    id: 44, category: "Frontend", difficulty: "hard",
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: ["No difference", "'==' checks type, '===' doesn't", "'===' checks both value and type, '==' only checks value", "'==' is deprecated"],
    correct: 2,
    explanation: "=== (strict equality) checks both value and type without coercion, while == performs type coercion before comparison."
  },
  {
    id: 45, category: "Aptitude", difficulty: "hard",
    question: "A car travels the first half of a distance at 40 km/h and the second half at 60 km/h. What is the average speed?",
    options: ["50 km/h", "48 km/h", "45 km/h", "52 km/h"],
    correct: 1,
    explanation: "Average speed for equal distances = 2ab/(a+b) = 2×40×60/(40+60) = 4800/100 = 48 km/h."
  },
  {
    id: 46, category: "Data Structures", difficulty: "medium",
    question: "Which data structure is used for implementing LRU Cache?",
    options: ["Array + Stack", "HashMap + Doubly Linked List", "Binary Tree", "Queue + Array"],
    correct: 1,
    explanation: "LRU Cache uses a HashMap for O(1) lookup and a Doubly Linked List for O(1) insertion/deletion to track usage order."
  },
  {
    id: 47, category: "Algorithms", difficulty: "hard",
    question: "What is memoization in dynamic programming?",
    options: ["Sorting results for faster access", "Storing results of expensive function calls to avoid recomputation", "Using extra memory for parallel processing", "Compressing data for storage"],
    correct: 1,
    explanation: "Memoization caches the results of function calls with specific inputs so that repeated calls with the same inputs return instantly."
  },
  {
    id: 48, category: "Aptitude", difficulty: "easy",
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correct: 1,
    explanation: "15% of 200 = 0.15 × 200 = 30."
  },
  {
    id: 49, category: "Behavioral", difficulty: "easy",
    question: "What is the most important skill for effective teamwork?",
    options: ["Being the smartest person in the room", "Clear communication", "Working independently", "Avoiding all conflicts"],
    correct: 1,
    explanation: "Clear communication ensures alignment, prevents misunderstandings, and helps the team collaborate effectively toward shared goals."
  },
  {
    id: 50, category: "Data Structures", difficulty: "easy",
    question: "What is the maximum number of children a node can have in a binary tree?",
    options: ["1", "2", "3", "Unlimited"],
    correct: 1,
    explanation: "In a binary tree, each node can have at most 2 children — a left child and a right child."
  }
];

// Category → role mapping
const ROLE_CATEGORIES = {
  all: ["Data Structures", "Algorithms", "Aptitude", "Behavioral", "Frontend"],
  ds: ["Data Structures"],
  algo: ["Algorithms"],
  aptitude: ["Aptitude"],
  behavioral: ["Behavioral"],
  frontend: ["Frontend"]
};
