export const STAGES = {
  beginner:     { label:'Beginner',     color:'var(--accent2)', xpMult:1,   timeMult:1.5 },
  intermediate: { label:'Intermediate', color:'var(--accent3)', xpMult:1.5, timeMult:1   },
  hard:         { label:'Hard',         color:'var(--rose)',    xpMult:2,   timeMult:0.7 },
};

export const LEADERBOARD_OTHERS = [
  { name:'Priya Sharma', score:2840, avatar:'PS', color:'#7C6EFA', sims:3 },
  { name:'Arjun Mehta',  score:2710, avatar:'AM', color:'#34D399', sims:3 },
  { name:'Neha Verma',   score:2590, avatar:'NV', color:'#F59E0B', sims:2 },
  { name:'Rohit Kumar',  score:2450, avatar:'RK', color:'#F87171', sims:2 },
  { name:'Sneha Patil',  score:2300, avatar:'SP', color:'#60A5FA', sims:1 },
];

export const defaultSimulations = () => ([
  { id:'sw',  title:'Software Developer', icon:'💻', color:'#7C6EFA',
    desc:'Build REST APIs, debug code, and work with databases — just like a junior dev.',
    duration:'3 hours', totalXP:1500, status:'active', progress:0,
    stageProgress:{ beginner:0, intermediate:0, hard:0 },
    languages:['JavaScript','TypeScript','Python','Java'] },
  { id:'ds',  title:'Data Science',       icon:'📊', color:'#34D399',
    desc:'Analyse datasets, build ML models, and create insights from real data.',
    duration:'2.5 hours', totalXP:1400, status:'active', progress:0,
    stageProgress:{ beginner:0, intermediate:0, hard:0 },
    languages:['Python','R','SQL'] },
  { id:'fin', title:'Finance Analyst',    icon:'💰', color:'#F59E0B',
    desc:'Build financial models, analyse P&L statements, create investor reports.',
    duration:'4 hours', totalXP:1600, status:'active', progress:0,
    stageProgress:{ beginner:0, intermediate:0, hard:0 },
    languages:['Excel / VBA','Python','SQL'] },
  { id:'ai',  title:'AI Engineer',        icon:'🤖', color:'#60A5FA',
    desc:'Design prompts, build agents, fine-tune models, ship production AI systems.',
    duration:'3.5 hours', totalXP:1800, status:'active', progress:0,
    stageProgress:{ beginner:0, intermediate:0, hard:0 },
    languages:['Python','JavaScript','SQL'] },
]);

export function buildTasksForRole(roleId) {
  const DB = {
    sw: {
      beginner: [
        { title:'Hello World API', time:'25',
          desc:`<h3>Task 1: Hello World Endpoint</h3><p>Create a basic Express.js <code>GET /hello</code> endpoint.</p><ul><li>Return HTTP 200</li><li>JSON body: <code>{ message: "Hello, SimWork!" }</code></li><li>Include <code>timestamp</code> field</li></ul>`,
          starterCode:`// Task 1: Hello World API\nconst express = require('express');\nconst app = express();\n\n// TODO: Create GET /hello endpoint\napp.get('/hello', (req, res) => {\n  // Your code here\n\n});\n\napp.listen(3000);\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `// Task 1: Hello World API\nconst express = require('express');\nconst app = express();\n\napp.get('/hello', (req, res) => {\n  // TODO: Return JSON with message and timestamp\n});\n\napp.listen(3000);\nmodule.exports = app;`,
            'TypeScript': `// Task 1: Hello World API (TypeScript)\nimport express, { Request, Response } from 'express';\nconst app = express();\n\napp.get('/hello', (req: Request, res: Response) => {\n  // TODO: Return JSON with message and timestamp\n});\n\napp.listen(3000);\nexport default app;`,
            'Python': `# Task 1: Hello World API (Python/Flask)\nfrom flask import Flask, jsonify\nfrom datetime import datetime\napp = Flask(__name__)\n\n@app.route('/hello')\ndef hello():\n    # TODO: Return JSON with message and timestamp\n    pass\n\nif __name__ == '__main__':\n    app.run(port=3000)`,
            'Java': `// Task 1: Hello World API (Java/Spring)\nimport org.springframework.web.bind.annotation.*;\nimport java.time.Instant;\nimport java.util.Map;\n\n@RestController\npublic class HelloController {\n\n    @GetMapping("/hello")\n    public Map<String, Object> hello() {\n        // TODO: Return map with message and timestamp\n        return Map.of();\n    }\n}`,
          },
          solution:'res.status(200).json',
          validationRules:['Has app.get handler','Returns JSON with message field','Returns timestamp','No TODO remaining'],
          tests:['GET /hello returns 200','Response has message field','Response has timestamp','message === "Hello, SimWork!"','Content-Type is JSON'] },

        { title:'Sum Function', time:'15',
          desc:`<h3>Task 2: Write a sum() function</h3><p>Export a <code>sum(a, b)</code> function that adds two numbers.</p><ul><li>Handle integers and floats</li><li>Throw error if non-numbers passed</li></ul>`,
          starterCode:`// Task 2: Sum Function\nfunction sum(a, b) {\n  // Your code here\n}\nmodule.exports = { sum };`,
          starterCodes: {
            'JavaScript': `// Task 2: Sum Function\nfunction sum(a, b) {\n  // TODO: Add type check and return sum\n}\nmodule.exports = { sum };`,
            'TypeScript': `// Task 2: Sum Function (TypeScript)\nexport function sum(a: number, b: number): number {\n  // TODO: Add type check and return sum\n  return 0;\n}`,
            'Python': `# Task 2: Sum Function (Python)\ndef sum_values(a, b):\n    # TODO: Add type check and return sum\n    pass`,
            'Java': `// Task 2: Sum Function (Java)\npublic class MathUtils {\n    public static double sum(double a, double b) {\n        // TODO: Add type check and return sum\n        return 0;\n    }\n}`,
          },
          solution:'typeof a',
          validationRules:['Function sum() defined','Handles two arguments','Type check included','module.exports present'],
          tests:['sum(1,2) === 3','sum(0.1,0.2) ≈ 0.3','TypeError on string input','Function exported','Works with negatives'] },

        { title:'Array Filter', time:'15',
          desc:`<h3>Task 3: Filter Even Numbers</h3><p>Write <code>filterEvens(arr)</code> that returns only even numbers.</p>`,
          starterCode:`// Task 3: Filter Evens\nfunction filterEvens(arr) {\n  // Your code here\n}\nmodule.exports = { filterEvens };`,
          starterCodes: {
            'JavaScript': `// Task 3: Filter Evens\nfunction filterEvens(arr) {\n  // TODO: Return only even numbers\n}\nmodule.exports = { filterEvens };`,
            'TypeScript': `// Task 3: Filter Evens (TypeScript)\nexport function filterEvens(arr: number[]): number[] {\n  // TODO: Return only even numbers\n  return [];\n}`,
            'Python': `# Task 3: Filter Evens (Python)\ndef filter_evens(arr):\n    # TODO: Return only even numbers\n    pass`,
            'Java': `// Task 3: Filter Evens (Java)\nimport java.util.List;\nimport java.util.stream.Collectors;\n\npublic class ArrayUtils {\n    public static List<Integer> filterEvens(List<Integer> arr) {\n        // TODO: Return only even numbers\n        return List.of();\n    }\n}`,
          },
          solution:'% 2 === 0',
          validationRules:['Function defined','Uses filter or loop','Modulo check present','Returns array'],
          tests:['filterEvens([1,2,3,4]) → [2,4]','Empty array returns []','All odd → []','All even → full array','Original array unchanged'] },

        { title:'String Reversal', time:'10',
          desc:`<h3>Task 4: Reverse a String</h3><p>Write <code>reverseStr(s)</code>.</p>`,
          starterCode:`// Task 4: Reverse a String\nfunction reverseStr(s) {\n  // Your code here\n}\nmodule.exports = { reverseStr };`,
          starterCodes: {
            'JavaScript': `// Task 4: Reverse a String\nfunction reverseStr(s) {\n  // TODO: Reverse the string\n}\nmodule.exports = { reverseStr };`,
            'TypeScript': `// Task 4: Reverse a String (TypeScript)\nexport function reverseStr(s: string): string {\n  // TODO: Reverse the string\n  return '';\n}`,
            'Python': `# Task 4: Reverse a String (Python)\ndef reverse_str(s: str) -> str:\n    # TODO: Reverse the string\n    pass`,
            'Java': `// Task 4: Reverse a String (Java)\npublic class StringUtils {\n    public static String reverseStr(String s) {\n        // TODO: Reverse the string\n        return \"\";\n    }\n}`,
          },
          solution:'split',
          validationRules:['Function defined','split/join or loop','Returns string','No mutation'],
          tests:['"hello" → "olleh"','Empty string ok','Single char ok','Spaces preserved','Palindrome unchanged'] },

        { title:'FizzBuzz', time:'15',
          desc:`<h3>Task 5: FizzBuzz</h3><p>Write <code>fizzBuzz(n)</code> that returns an array 1..n with FizzBuzz rules.</p>`,
          starterCode:`// Task 5: FizzBuzz\nfunction fizzBuzz(n) {\n  const result = [];\n  // TODO: Fizz (÷3), Buzz (÷5), FizzBuzz (÷15)\n  return result;\n}\nmodule.exports = { fizzBuzz };`,
          starterCodes: {
            'JavaScript': `// Task 5: FizzBuzz\nfunction fizzBuzz(n) {\n  const result = [];\n  // TODO: Push 'Fizz', 'Buzz', 'FizzBuzz', or number\n  return result;\n}\nmodule.exports = { fizzBuzz };`,
            'TypeScript': `// Task 5: FizzBuzz (TypeScript)\nexport function fizzBuzz(n: number): (string | number)[] {\n  const result: (string | number)[] = [];\n  // TODO: Push 'Fizz', 'Buzz', 'FizzBuzz', or number\n  return result;\n}`,
            'Python': `# Task 5: FizzBuzz (Python)\ndef fizz_buzz(n: int) -> list:\n    result = []\n    # TODO: Append 'Fizz', 'Buzz', 'FizzBuzz', or number\n    return result`,
            'Java': `// Task 5: FizzBuzz (Java)\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class FizzBuzz {\n    public static List<String> fizzBuzz(int n) {\n        List<String> result = new ArrayList<>();\n        // TODO: Add 'Fizz', 'Buzz', 'FizzBuzz', or number\n        return result;\n    }\n}`,
          },
          solution:'FizzBuzz',
          validationRules:['FizzBuzz case handled','Fizz case handled','Buzz case handled','Returns array of length n'],
          tests:['15 → "FizzBuzz"','3 → "Fizz"','5 → "Buzz"','1 → 1','Array length === n'] },
      ],

      intermediate: [
        { title:'REST API with CRUD', time:'40',
          desc:`<h3>Task 1: Full CRUD REST API</h3><p>Build a Users resource with all 5 endpoints using Express.</p>`,
          starterCode:`const express = require('express');\nconst app = express();\napp.use(express.json());\nlet users = [{id:1,name:'Alice'},{id:2,name:'Bob'}];\nlet nextId = 3;\n// TODO: Implement all 5 CRUD endpoints\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const express = require('express');\nconst app = express();\napp.use(express.json());\nlet users = [{id:1,name:'Alice'},{id:2,name:'Bob'}];\nlet nextId = 3;\n\n// TODO: GET /users\n// TODO: GET /users/:id\n// TODO: POST /users\n// TODO: PUT /users/:id\n// TODO: DELETE /users/:id\n\nmodule.exports = app;`,
            'TypeScript': `import express, { Request, Response } from 'express';\nconst app = express();\napp.use(express.json());\n\ninterface User { id: number; name: string; }\nlet users: User[] = [{id:1,name:'Alice'},{id:2,name:'Bob'}];\nlet nextId = 3;\n\n// TODO: Implement all 5 CRUD endpoints\n\nexport default app;`,
            'Python': `# REST API with CRUD (Python/Flask)\nfrom flask import Flask, jsonify, request\napp = Flask(__name__)\n\nusers = [{'id':1,'name':'Alice'},{'id':2,'name':'Bob'}]\nnext_id = 3\n\n# TODO: GET /users\n# TODO: GET /users/<id>\n# TODO: POST /users\n# TODO: PUT /users/<id>\n# TODO: DELETE /users/<id>\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// REST API with CRUD (Java/Spring)\nimport org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@RestController\n@RequestMapping("/users")\npublic class UserController {\n    private List<Map<String,Object>> users = new ArrayList<>();\n    private int nextId = 1;\n\n    // TODO: @GetMapping - list all\n    // TODO: @GetMapping("/{id}") - get one\n    // TODO: @PostMapping - create\n    // TODO: @PutMapping("/{id}") - update\n    // TODO: @DeleteMapping("/{id}") - delete\n}`,
          },
          solution:'app.get',
          validationRules:['GET /users defined','POST /users defined','PUT /users/:id defined','DELETE /users/:id defined','404 handling present'],
          tests:['GET /users returns array','POST creates user','GET /users/:id works','PUT updates user','DELETE removes user'] },

        { title:'JWT Authentication', time:'40',
          desc:`<h3>Task 2: JWT Auth Middleware</h3><p>Add authentication to protect routes.</p>`,
          starterCode:`const express = require('express');\nconst jwt = require('jsonwebtoken');\nconst app = express();\napp.use(express.json());\nconst SECRET = 'simwork-secret';\n// TODO: POST /auth/login\n// TODO: verifyToken middleware\n// TODO: GET /protected\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const express = require('express');\nconst jwt = require('jsonwebtoken');\nconst app = express();\napp.use(express.json());\nconst SECRET = 'simwork-secret';\n\n// TODO: POST /auth/login — return signed JWT\n// TODO: verifyToken middleware — check Authorization header\n// TODO: GET /protected — use verifyToken\n\nmodule.exports = app;`,
            'TypeScript': `import express, { Request, Response, NextFunction } from 'express';\nimport jwt from 'jsonwebtoken';\nconst app = express();\napp.use(express.json());\nconst SECRET = 'simwork-secret';\n\n// TODO: POST /auth/login\n// TODO: verifyToken middleware\n// TODO: GET /protected\n\nexport default app;`,
            'Python': `# JWT Auth (Python/Flask)\nfrom flask import Flask, jsonify, request\nimport jwt\nimport datetime\napp = Flask(__name__)\nSECRET = 'simwork-secret'\n\n# TODO: POST /auth/login — return signed JWT\n# TODO: verify_token decorator\n# TODO: GET /protected — use decorator\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// JWT Auth (Java/Spring)\nimport io.jsonwebtoken.*;\nimport org.springframework.web.bind.annotation.*;\n\n@RestController\npublic class AuthController {\n    private static final String SECRET = "simwork-secret";\n\n    // TODO: POST /auth/login\n    // TODO: JwtFilter extends OncePerRequestFilter\n    // TODO: GET /protected\n}`,
          },
          solution:'jwt.sign',
          validationRules:['jwt.sign used','jwt.verify used','401 on bad token','Protected route exists','Login endpoint exists'],
          tests:['Login returns token','Invalid creds → 401','No token → 401','Valid token → 200','Token contains user id'] },

        { title:'Async/Await', time:'30',
          desc:`<h3>Task 3: Async Data Fetching</h3><p>Refactor callback-based code to async/await.</p>`,
          starterCode:`const db = { getUser: (id) => new Promise((res,rej) => setTimeout(()=> id>0 ? res({id,name:'User'+id}) : rej(new Error('Not found')),100)) };\nasync function getUserById(id) {\n  // Your code\n}\nasync function getUsers(ids) {\n  // Your code - use Promise.all\n}\nmodule.exports = {getUserById, getUsers};`,
          starterCodes: {
            'JavaScript': `const db = { getUser: (id) => new Promise((res,rej) => setTimeout(()=> id>0 ? res({id,name:'User'+id}) : rej(new Error('Not found')),100)) };\n\nasync function getUserById(id) {\n  // TODO: await db.getUser, handle errors\n}\n\nasync function getUsers(ids) {\n  // TODO: Promise.all to fetch all in parallel\n}\n\nmodule.exports = {getUserById, getUsers};`,
            'TypeScript': `interface User { id: number; name: string; }\nconst db = { getUser: (id: number): Promise<User> => new Promise((res,rej) => setTimeout(()=> id>0 ? res({id,name:'User'+id}) : rej(new Error('Not found')),100)) };\n\nexport async function getUserById(id: number): Promise<User> {\n  // TODO: await db.getUser, handle errors\n}\n\nexport async function getUsers(ids: number[]): Promise<User[]> {\n  // TODO: Promise.all\n}`,
            'Python': `# Async/Await (Python)\nimport asyncio\n\nasync def get_user(user_id: int) -> dict:\n    await asyncio.sleep(0.1)\n    if user_id > 0:\n        return {'id': user_id, 'name': f'User{user_id}'}\n    raise ValueError('Not found')\n\nasync def get_user_by_id(user_id: int) -> dict:\n    # TODO: await get_user, handle errors\n    pass\n\nasync def get_users(ids: list) -> list:\n    # TODO: asyncio.gather for parallel fetch\n    pass`,
            'Java': `// Async (Java/CompletableFuture)\nimport java.util.concurrent.*;\nimport java.util.List;\n\npublic class UserService {\n    public CompletableFuture<Map<String,Object>> getUser(int id) {\n        return CompletableFuture.supplyAsync(() -> Map.of("id", id, "name", "User"+id));\n    }\n\n    public CompletableFuture<Map<String,Object>> getUserById(int id) {\n        // TODO: call getUser, handle exceptions\n        return null;\n    }\n\n    public CompletableFuture<List<?>> getUsers(List<Integer> ids) {\n        // TODO: allOf for parallel fetch\n        return null;\n    }\n}`,
          },
          solution:'await db.getUser',
          validationRules:['async keyword used','await keyword used','try/catch present','Promise.all used','Both functions exported'],
          tests:['getUserById(1) resolves','getUserById(-1) rejects','getUsers([1,2]) parallel','Error caught properly','Functions exported'] },

        { title:'Middleware Chain', time:'35',
          desc:`<h3>Task 4: Custom Middleware</h3><p>Build 3 middlewares: logger, auth, and rate limiter.</p>`,
          starterCode:`const express = require('express');\nconst app = express();\n// TODO: logger middleware\n// TODO: authCheck middleware\n// TODO: rateLimiter middleware\n// Apply middlewares and create GET /api/data\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const express = require('express');\nconst app = express();\n\n// TODO: logger — log method, url, timestamp\nconst logger = (req, res, next) => { };\n\n// TODO: authCheck — check x-api-key header\nconst authCheck = (req, res, next) => { };\n\n// TODO: rateLimiter — max 10 req/min per IP\nconst rateLimiter = (req, res, next) => { };\n\napp.use(logger);\napp.get('/api/data', authCheck, rateLimiter, (req, res) => {\n  res.json({ data: 'protected' });\n});\n\nmodule.exports = app;`,
            'TypeScript': `import express, { Request, Response, NextFunction } from 'express';\nconst app = express();\n\n// TODO: logger middleware\nconst logger = (req: Request, res: Response, next: NextFunction) => { next(); };\n\n// TODO: authCheck middleware\nconst authCheck = (req: Request, res: Response, next: NextFunction) => { next(); };\n\n// TODO: rateLimiter middleware\nconst rateLimiter = (req: Request, res: Response, next: NextFunction) => { next(); };\n\nexport default app;`,
            'Python': `# Middleware Chain (Python/Flask)\nfrom flask import Flask, request, jsonify\nfrom functools import wraps\nimport time\napp = Flask(__name__)\n\n# TODO: logger decorator\n# TODO: auth_check decorator — check x-api-key\n# TODO: rate_limiter decorator\n\n@app.route('/api/data')\ndef get_data():\n    return jsonify({'data': 'protected'})\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// Middleware Chain (Java/Spring)\nimport org.springframework.web.servlet.HandlerInterceptor;\nimport javax.servlet.http.HttpServletRequest;\nimport javax.servlet.http.HttpServletResponse;\n\n// TODO: LoggingInterceptor implements HandlerInterceptor\n// TODO: AuthInterceptor implements HandlerInterceptor\n// TODO: RateLimitInterceptor implements HandlerInterceptor\n// TODO: Register all in WebMvcConfigurer`,
          },
          solution:'req.method',
          validationRules:['Logger middleware defined','Auth check defined','Rate limiter defined','Middlewares applied','GET /api/data exists'],
          tests:['Logger logs requests','Wrong key → 401','No key → 401','Valid key → 200','Rate limit enforced'] },

        { title:'Error Handling', time:'30',
          desc:`<h3>Task 5: Global Error Handler</h3><p>Add comprehensive error handling.</p>`,
          starterCode:`const express = require('express');\nconst app = express();\napp.use(express.json());\n// TODO: validateUser middleware\n// TODO: POST /users with validation\n// TODO: Global error handler (4 params)\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const express = require('express');\nconst app = express();\napp.use(express.json());\n\n// TODO: validateUser — check name and email\nconst validateUser = (req, res, next) => { };\n\n// TODO: POST /users with validateUser\napp.post('/users', validateUser, (req, res) => { });\n\n// TODO: Global error handler — 4 params (err, req, res, next)\n\nmodule.exports = app;`,
            'TypeScript': `import express, { Request, Response, NextFunction } from 'express';\nconst app = express();\napp.use(express.json());\n\nclass AppError extends Error {\n  constructor(public message: string, public status: number, public code: string) { super(message); }\n}\n\n// TODO: validateUser middleware\n// TODO: POST /users\n// TODO: Global error handler\n\nexport default app;`,
            'Python': `# Error Handling (Python/Flask)\nfrom flask import Flask, jsonify, request\nfrom datetime import datetime\napp = Flask(__name__)\n\nclass AppError(Exception):\n    def __init__(self, message, status=400, code='ERROR'):\n        self.message = message\n        self.status = status\n        self.code = code\n\n# TODO: validate_user function\n# TODO: POST /users with validation\n# TODO: @app.errorhandler(AppError)\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// Error Handling (Java/Spring)\nimport org.springframework.web.bind.annotation.*;\nimport org.springframework.http.ResponseEntity;\n\n@RestControllerAdvice\npublic class GlobalErrorHandler {\n    // TODO: @ExceptionHandler(ValidationException.class)\n    // TODO: @ExceptionHandler(Exception.class)\n}\n\n@RestController\npublic class UserController {\n    // TODO: POST /users with @Valid\n}`,
          },
          solution:'err, req, res, next',
          validationRules:['4-param error handler','Validation middleware','Error format consistent','Timestamp in errors','HTTP status codes correct'],
          tests:['Missing name → 400','Missing email → 400','Error has timestamp','Error has code field','Global handler catches all'] },
      ],

      hard: [
        { title:'Microservice Architecture', time:'60',
          desc:`<h3>Task 1: Event-Driven Microservice</h3><p>Build a message-queue based microservice with pub/sub, retry logic, and health checks.</p>`,
          starterCode:`const EventEmitter = require('events');\nconst express = require('express');\nconst app = express();\n// TODO: MessageQueue class\n// TODO: Dead letter queue after 3 retries\n// TODO: GET /health endpoint\n// TODO: POST /queue/publish\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const EventEmitter = require('events');\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\nclass MessageQueue extends EventEmitter {\n  // TODO: publish(topic, message)\n  // TODO: subscribe(topic, handler)\n  // TODO: Dead letter queue after 3 retries\n}\n\nconst mq = new MessageQueue();\n\n// TODO: GET /health\n// TODO: POST /queue/publish\n\nmodule.exports = app;`,
            'TypeScript': `import { EventEmitter } from 'events';\nimport express from 'express';\nconst app = express();\napp.use(express.json());\n\ninterface Message { topic: string; payload: any; retries?: number; }\n\nclass MessageQueue extends EventEmitter {\n  // TODO: publish(topic: string, message: any): void\n  // TODO: subscribe(topic: string, handler: Function): void\n  // TODO: DLQ after 3 retries\n}\n\nexport default app;`,
            'Python': `# Microservice (Python)\nfrom flask import Flask, jsonify, request\nimport threading, queue, time\napp = Flask(__name__)\n\nclass MessageQueue:\n    def __init__(self):\n        self.queues = {}\n        self.dlq = []\n    # TODO: publish(topic, message)\n    # TODO: subscribe(topic, handler)\n    # TODO: DLQ after 3 retries\n\nmq = MessageQueue()\n\n# TODO: GET /health\n# TODO: POST /queue/publish\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// Microservice (Java)\nimport java.util.*;\nimport java.util.concurrent.*;\n\npublic class MessageQueue {\n    private Map<String, List<Object>> queues = new HashMap<>();\n    private List<Object> deadLetterQueue = new ArrayList<>();\n\n    // TODO: publish(String topic, Object message)\n    // TODO: subscribe(String topic, Consumer handler)\n    // TODO: DLQ after 3 retries\n}`,
          },
          solution:'EventEmitter',
          validationRules:['MessageQueue class defined','publish() method exists','subscribe() method exists','DLQ handling present','Health endpoint defined'],
          tests:['Messages published','Subscribers receive','Retry on failure','DLQ after 3 fails','Health returns 200'] },

        { title:'WebSocket Real-Time', time:'50',
          desc:`<h3>Task 2: WebSocket Chat Server</h3>`,
          starterCode:`const WebSocket = require('ws');\nconst http = require('http');\nconst server = http.createServer();\nconst wss = new WebSocket.Server({server});\n// TODO: Handle connections, rooms, broadcast\nmodule.exports = server;`,
          starterCodes: {
            'JavaScript': `const WebSocket = require('ws');\nconst http = require('http');\nconst server = http.createServer();\nconst wss = new WebSocket.Server({server});\nconst rooms = new Map();\n\nwss.on('connection', (ws) => {\n  // TODO: Handle 'join', 'message', 'leave'\n  // TODO: Broadcast to room members\n  // TODO: Track presence\n});\n\nmodule.exports = server;`,
            'TypeScript': `import WebSocket from 'ws';\nimport http from 'http';\nconst server = http.createServer();\nconst wss = new WebSocket.Server({server});\nconst rooms = new Map<string, Set<WebSocket>>();\n\nwss.on('connection', (ws: WebSocket) => {\n  // TODO: Handle join/message/leave\n});\n\nexport default server;`,
            'Python': `# WebSocket Chat (Python)\nimport asyncio\nimport websockets\nimport json\nrooms = {}\n\nasync def handler(websocket, path):\n    # TODO: Handle join, message, leave\n    # TODO: Broadcast to room\n    pass\n\nstart_server = websockets.serve(handler, 'localhost', 8765)\nasyncio.get_event_loop().run_until_complete(start_server)\nasyncio.get_event_loop().run_forever()`,
            'Java': `// WebSocket Chat (Java/Spring)\nimport org.springframework.web.socket.*;\nimport org.springframework.web.socket.handler.TextWebSocketHandler;\nimport java.util.*;\n\npublic class ChatHandler extends TextWebSocketHandler {\n    private Map<String, Set<WebSocketSession>> rooms = new HashMap<>();\n\n    // TODO: handleTextMessage — parse join/message/leave\n    // TODO: broadcastToRoom(room, message)\n    // TODO: afterConnectionClosed — update presence\n}`,
          },
          solution:'wss.on',
          validationRules:['Connection handler defined','Room management code','Broadcast function','Message format handled','Presence tracking'],
          tests:['Clients connect','Join room works','Broadcast to room','Leave updates presence','Error handling present'] },

        { title:'Caching Layer', time:'55',
          desc:`<h3>Task 3: Redis-style In-Memory Cache</h3>`,
          starterCode:`class LRUCache {\n  constructor(capacity) {\n    // Your code\n  }\n  get(key) { }\n  set(key, value, ttl) { }\n}\nmodule.exports = LRUCache;`,
          starterCodes: {
            'JavaScript': `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    // TODO: Initialize data structures\n  }\n  get(key) {\n    // TODO: Return value or -1, update recency\n  }\n  set(key, value, ttl = null) {\n    // TODO: Evict LRU if at capacity, set TTL\n  }\n}\nmodule.exports = LRUCache;`,
            'TypeScript': `class LRUCache<T = any> {\n  private capacity: number;\n  private cache: Map<string, {value: T; expires?: number}>;\n\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key: string): T | null {\n    // TODO: Return value or null, update recency\n    return null;\n  }\n\n  set(key: string, value: T, ttl?: number): void {\n    // TODO: Evict LRU if at capacity\n  }\n}\nexport default LRUCache;`,
            'Python': `# LRU Cache (Python)\nfrom collections import OrderedDict\nimport time\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        # TODO: Initialize data structures\n\n    def get(self, key: str):\n        # TODO: Return value or None, update recency\n        pass\n\n    def set(self, key: str, value, ttl: float = None):\n        # TODO: Evict LRU if at capacity, handle TTL\n        pass`,
            'Java': `// LRU Cache (Java)\nimport java.util.*;\n\npublic class LRUCache<V> {\n    private final int capacity;\n    private final LinkedHashMap<String, V> cache;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        // TODO: Initialize LinkedHashMap with access order\n    }\n\n    public V get(String key) {\n        // TODO: Return value or null\n        return null;\n    }\n\n    public void set(String key, V value, long ttlMs) {\n        // TODO: Evict if full, insert\n    }\n}`,
          },
          solution:'LRUCache',
          validationRules:['LRUCache class defined','get() method','set() method with TTL','LRU eviction logic','Stats tracking'],
          tests:['get/set works','TTL expiry works','LRU evicts oldest','Capacity respected','Stats tracked'] },

        { title:'Graph BFS/DFS', time:'45',
          desc:`<h3>Task 4: Graph Traversal</h3>`,
          starterCode:`class Graph {\n  constructor() { this.adj = new Map(); }\n  addEdge(u, v, w=1) { }\n  BFS(start) { }\n  DFS(start) { }\n  shortestPath(start, end) { }\n  hasCycle() { }\n}\nmodule.exports = Graph;`,
          starterCodes: {
            'JavaScript': `class Graph {\n  constructor() { this.adj = new Map(); }\n\n  addEdge(u, v, w = 1) {\n    // TODO: Add bidirectional edge with weight\n  }\n  BFS(start) {\n    // TODO: Return visited order array\n  }\n  DFS(start) {\n    // TODO: Return visited order array\n  }\n  shortestPath(start, end) {\n    // TODO: Dijkstra or BFS\n  }\n  hasCycle() {\n    // TODO: DFS-based cycle detection\n  }\n}\nmodule.exports = Graph;`,
            'TypeScript': `class Graph {\n  private adj: Map<string, {node: string; weight: number}[]>;\n\n  constructor() { this.adj = new Map(); }\n\n  addEdge(u: string, v: string, w = 1): void { }\n  BFS(start: string): string[] { return []; }\n  DFS(start: string): string[] { return []; }\n  shortestPath(start: string, end: string): string[] { return []; }\n  hasCycle(): boolean { return false; }\n}\nexport default Graph;`,
            'Python': `# Graph (Python)\nfrom collections import deque\nimport heapq\n\nclass Graph:\n    def __init__(self):\n        self.adj = {}\n\n    def add_edge(self, u, v, w=1):\n        # TODO: Bidirectional\n        pass\n\n    def bfs(self, start):\n        # TODO: Return visited order\n        pass\n\n    def dfs(self, start):\n        # TODO: Return visited order\n        pass\n\n    def shortest_path(self, start, end):\n        # TODO: Dijkstra\n        pass\n\n    def has_cycle(self):\n        # TODO: DFS cycle detection\n        pass`,
            'Java': `// Graph (Java)\nimport java.util.*;\n\npublic class Graph {\n    private Map<String, List<int[]>> adj = new HashMap<>();\n\n    public void addEdge(String u, String v, int w) { }\n    public List<String> bfs(String start) { return List.of(); }\n    public List<String> dfs(String start) { return List.of(); }\n    public List<String> shortestPath(String start, String end) { return List.of(); }\n    public boolean hasCycle() { return false; }\n}`,
          },
          solution:'new Map',
          validationRules:['BFS() implemented','DFS() implemented','shortestPath() exists','hasCycle() exists','Graph class exported'],
          tests:['BFS order correct','DFS order correct','Shortest path found','Cycle detected','Disconnected graph handled'] },

        { title:'URL Shortener', time:'70',
          desc:`<h3>Task 5: URL Shortener Service</h3>`,
          starterCode:`const express = require('express');\nconst app = express();\napp.use(express.json());\n// TODO: POST /shorten\n// TODO: GET /:slug redirect\n// TODO: GET /stats/:slug\n// TODO: Rate limit\n// TODO: Expiry logic\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `const express = require('express');\nconst app = express();\napp.use(express.json());\nconst store = new Map(); // slug → { url, clicks, expires }\n\n// TODO: POST /shorten — generate slug, store with optional TTL\n// TODO: GET /:slug — redirect and increment clicks\n// TODO: GET /stats/:slug — return analytics\n// TODO: Rate limit — max 10 req/min per IP\n// TODO: Return 410 for expired links\n\nmodule.exports = app;`,
            'TypeScript': `import express from 'express';\nconst app = express();\napp.use(express.json());\n\ninterface LinkData { url: string; clicks: number; expires?: number; }\nconst store = new Map<string, LinkData>();\n\n// TODO: POST /shorten\n// TODO: GET /:slug\n// TODO: GET /stats/:slug\n\nexport default app;`,
            'Python': `# URL Shortener (Python/Flask)\nfrom flask import Flask, jsonify, request, redirect\nimport random, string, time\napp = Flask(__name__)\nstore = {} # slug → { url, clicks, expires }\n\n# TODO: POST /shorten\n# TODO: GET /<slug>\n# TODO: GET /stats/<slug>\n# TODO: Rate limiting\n\nif __name__ == '__main__':\n    app.run(debug=True)`,
            'Java': `// URL Shortener (Java/Spring)\nimport org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@RestController\npublic class UrlShortenerController {\n    private Map<String, Map<String,Object>> store = new HashMap<>();\n\n    // TODO: @PostMapping("/shorten")\n    // TODO: @GetMapping("/{slug}") — redirect\n    // TODO: @GetMapping("/stats/{slug}")\n}`,
          },
          solution:'slug',
          validationRules:['POST /shorten defined','GET /:slug redirect','Stats endpoint exists','Rate limiting present','Expiry logic present'],
          tests:['URL shortened','Redirect works','Analytics tracked','Rate limit fires','Expired links → 410'] },
      ],
    },

    ds: {
      beginner: [
        { title:'Data Loading & EDA', time:'20',
          desc:`<h3>Task 1: Load & Explore Dataset</h3><p>Load a CSV dataset and perform basic exploratory data analysis.</p>`,
          starterCode:`# Task 1: EDA\nimport pandas as pd\nimport numpy as np\ndata = {'age':[25,30,None,22,28],'salary':[50000,60000,55000,None,70000]}\ndf = pd.DataFrame(data)\n# TODO: Print shape, dtypes, describe(), missing values`,
          starterCodes: {
            'Python': `# Task 1: EDA (Python)\nimport pandas as pd\nimport numpy as np\ndata = {'age':[25,30,None,22,28],'salary':[50000,60000,55000,None,70000]}\ndf = pd.DataFrame(data)\n\n# TODO: Print df.shape\n# TODO: Print df.dtypes\n# TODO: Print df.describe()\n# TODO: Print missing values (isnull().sum())`,
            'R': `# Task 1: EDA (R)\ndf <- data.frame(\n  age = c(25, 30, NA, 22, 28),\n  salary = c(50000, 60000, 55000, NA, 70000)\n)\n\n# TODO: Print dim(df)\n# TODO: Print str(df)\n# TODO: Print summary(df)\n# TODO: Print colSums(is.na(df))`,
            'SQL': `-- Task 1: EDA (SQL)\nCREATE TABLE employees (age INT, salary DECIMAL);\nINSERT INTO employees VALUES (25,50000),(30,60000),(NULL,55000),(22,NULL),(28,70000);\n\n-- TODO: Count rows\n-- TODO: Find NULL counts per column\n-- TODO: Compute AVG, MIN, MAX for age and salary\n-- TODO: Show data types`,
          },
          solution:'isnull().sum()',
          validationRules:['df.shape used','describe() called','isnull() used','dtypes printed'],
          tests:['Shape printed','Dtypes shown','Missing values found','Statistics computed','Dataset loaded'] },

        { title:'Data Cleaning', time:'25',
          desc:`<h3>Task 2: Clean the Data</h3>`,
          starterCode:`import pandas as pd\ndata = {'name':['Alice','Bob','Alice',None],'age':[25,None,25,30]}\ndf = pd.DataFrame(data)\n# TODO: Fill missing, remove duplicates, fix types`,
          starterCodes: {
            'Python': `import pandas as pd\ndata = {'name':['Alice','Bob','Alice',None],'age':[25,None,25,30]}\ndf = pd.DataFrame(data)\n\n# TODO: fillna for name and age\n# TODO: drop_duplicates()\n# TODO: Convert age to numeric\n# TODO: Filter outliers`,
            'R': `df <- data.frame(\n  name = c('Alice','Bob','Alice',NA),\n  age = c(25, NA, 25, 30)\n)\n\n# TODO: Replace NA values\n# TODO: Remove duplicates with unique()\n# TODO: Convert types\n# TODO: Filter outliers`,
            'SQL': `-- Data Cleaning (SQL)\nCREATE TABLE users (name VARCHAR(50), age INT);\nINSERT INTO users VALUES ('Alice',25),('Bob',NULL),('Alice',25),(NULL,30);\n\n-- TODO: Update NULL names\n-- TODO: Delete duplicate rows\n-- TODO: Cast age to correct type\n-- TODO: Remove outlier ages`,
          },
          solution:'fillna',
          validationRules:['fillna() used','drop_duplicates() called','pd.to_numeric used','Outlier filter applied'],
          tests:['Missing filled','Duplicates removed','Score converted','Outliers dropped','Clean df printed'] },

        { title:'Basic Statistics', time:'20',
          desc:`<h3>Task 3: Compute Statistics</h3>`,
          starterCode:`import numpy as np\nscores = [78,85,92,88,76,95,84,79,91,83]\n# TODO: mean, median, std, percentiles`,
          starterCodes: {
            'Python': `import numpy as np\nscores = [78,85,92,88,76,95,84,79,91,83]\n\n# TODO: np.mean(scores)\n# TODO: np.median(scores)\n# TODO: np.std(scores)\n# TODO: np.percentile(scores, [25, 75])`,
            'R': `scores <- c(78,85,92,88,76,95,84,79,91,83)\n\n# TODO: mean(scores)\n# TODO: median(scores)\n# TODO: sd(scores)\n# TODO: quantile(scores, c(0.25, 0.75))`,
            'SQL': `-- Statistics (SQL)\nCREATE TABLE scores (val INT);\nINSERT INTO scores VALUES (78),(85),(92),(88),(76),(95),(84),(79),(91),(83);\n\n-- TODO: SELECT AVG, MIN, MAX\n-- TODO: Compute standard deviation\n-- TODO: Find median (use PERCENTILE_CONT)\n-- TODO: Find 25th and 75th percentiles`,
          },
          solution:'np.mean',
          validationRules:['Mean computed','Median computed','Std computed','Percentile used'],
          tests:['Mean correct','Median correct','Std computed','Percentiles found','Correlation calculated'] },

        { title:'Visualization', time:'20',
          desc:`<h3>Task 4: Plot Data</h3>`,
          starterCode:`import matplotlib.pyplot as plt\nimport numpy as np\ndata = np.random.normal(170, 10, 200)\n# TODO: Histogram, bar chart, scatter plot`,
          starterCodes: {
            'Python': `import matplotlib.pyplot as plt\nimport numpy as np\ndata = np.random.normal(170, 10, 200)\n\n# TODO: plt.hist(data, bins=20)\n# TODO: plt.bar(['A','B','C'], [10,20,15])\n# TODO: plt.scatter(np.arange(200), data)\n# TODO: Add title, labels, show()`,
            'R': `data <- rnorm(200, mean=170, sd=10)\n\n# TODO: hist(data, breaks=20)\n# TODO: barplot(c(A=10,B=20,C=15))\n# TODO: plot(1:200, data, type='p')\n# TODO: Add titles and labels`,
            'SQL': `-- Visualization data prep (SQL)\n-- Prepare aggregated data for charting\nCREATE TABLE heights (val DECIMAL);\n\n-- TODO: GROUP BY bins for histogram\n-- TODO: COUNT per category for bar chart\n-- TODO: SELECT x, y pairs for scatter`,
          },
          solution:'plt.hist',
          validationRules:['plt.hist used','plt.bar used','plt.scatter used','plt.title used'],
          tests:['Histogram plotted','Bar chart created','Scatter rendered','Labels added','Show called'] },
      ],

      intermediate: [
        { title:'Feature Engineering', time:'35',
          desc:`<h3>Task 1: Feature Engineering</h3>`,
          starterCode:`import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\ndf = pd.DataFrame({'age':[22,35,28,45],'salary':[30000,70000,50000,90000]})\n# TODO: Age bins, one-hot encode, scale salary`,
          starterCodes: {
            'Python': `import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\ndf = pd.DataFrame({'age':[22,35,28,45],'salary':[30000,70000,50000,90000],'dept':['IT','HR','IT','Finance']})\n\n# TODO: pd.cut() for age bins\n# TODO: pd.get_dummies() for dept\n# TODO: StandardScaler().fit_transform() for salary\n# TODO: Create interaction feature`,
            'R': `df <- data.frame(age=c(22,35,28,45), salary=c(30000,70000,50000,90000))\n\n# TODO: cut() for age bins\n# TODO: model.matrix() for encoding\n# TODO: scale() for salary\n# TODO: Create new features`,
            'SQL': `-- Feature Engineering (SQL)\nSELECT\n  age,\n  salary,\n  -- TODO: CASE WHEN age bins\n  -- TODO: salary / AVG(salary) OVER() normalization\n  -- TODO: Compute interaction feature\nFROM employees;`,
          },
          solution:'pd.cut',
          validationRules:['pd.cut used','get_dummies or OHE','StandardScaler fit','New feature created'],
          tests:['Age binned','Dept encoded','Salary scaled','New feature added','No NaN in output'] },

        { title:'Linear Regression', time:'40',
          desc:`<h3>Task 2: Build Linear Regression Model</h3>`,
          starterCode:`from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\nX = np.random.rand(200,1)*100\ny = 2.5*X.flatten() + np.random.randn(200)*10\n# TODO: Split, train, evaluate`,
          starterCodes: {
            'Python': `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\nX = np.random.rand(200,1)*100\ny = 2.5*X.flatten() + np.random.randn(200)*10\n\n# TODO: train_test_split(X, y, test_size=0.2)\n# TODO: model.fit(X_train, y_train)\n# TODO: model.predict(X_test)\n# TODO: Compute MSE and R²\n# TODO: Print coefficients`,
            'R': `set.seed(42)\nX <- runif(200, 0, 100)\ny <- 2.5*X + rnorm(200, 0, 10)\ndf <- data.frame(X=X, y=y)\n\n# TODO: Split 80/20\n# TODO: lm(y ~ X, data=train)\n# TODO: predict() on test\n# TODO: Compute MSE and R²`,
            'SQL': `-- Linear Regression prep (SQL)\n-- Compute slope and intercept manually\nWITH stats AS (\n  SELECT\n    AVG(x) AS mean_x, AVG(y) AS mean_y,\n    -- TODO: SUM((x - mean_x)*(y - mean_y)) / SUM((x-mean_x)^2) AS slope\n    -- TODO: intercept = mean_y - slope * mean_x\n  FROM data_table\n)\nSELECT * FROM stats;`,
          },
          solution:'LinearRegression',
          validationRules:['train_test_split used','model.fit called','r2_score computed','Coefficients printed'],
          tests:['Data split 80/20','Model trained','MSE computed','R² > 0.8','Coefficients shown'] },

        { title:'Classification', time:'40',
          desc:`<h3>Task 3: Classification with Random Forest</h3>`,
          starterCode:`from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\n# TODO: Train, cross-validate, print feature importance`,
          starterCodes: {
            'Python': `from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\n\n# TODO: RandomForestClassifier(n_estimators=100, random_state=42)\n# TODO: cross_val_score(model, X, y, cv=5)\n# TODO: model.fit(X, y)\n# TODO: Print feature_importances_`,
            'R': `library(randomForest)\ndata(iris)\n\n# TODO: randomForest(Species ~ ., data=iris, ntree=100)\n# TODO: Cross-validate with caret\n# TODO: importance() for feature importance\n# TODO: Print accuracy`,
            'SQL': `-- Classification prep (SQL)\n-- Compute feature statistics for Naive Bayes\nSELECT\n  species,\n  AVG(sepal_length) AS mean_sl,\n  STDDEV(sepal_length) AS std_sl,\n  COUNT(*) AS n\nFROM iris\nGROUP BY species;`,
          },
          solution:'RandomForestClassifier',
          validationRules:['RandomForestClassifier used','cross_val_score called','feature_importances_ accessed','Mean accuracy printed'],
          tests:['Model initialized','Cross-val done','Accuracy > 0.9','Feature importance shown','5-fold CV used'] },

        { title:'Model Pipeline', time:'45',
          desc:`<h3>Task 4: Sklearn Pipeline</h3>`,
          starterCode:`from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\n# TODO: Pipeline + GridSearch`,
          starterCodes: {
            'Python': `from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\n\n# TODO: Pipeline([('scaler', StandardScaler()), ('svc', SVC())])\n# TODO: param_grid = {'svc__C': [0.1, 1, 10]}\n# TODO: GridSearchCV(pipe, param_grid, cv=5)\n# TODO: grid.fit(X, y)\n# TODO: Print best_params_ and best_score_`,
            'R': `library(caret)\ndata(iris)\n\n# TODO: preProcess() for scaling\n# TODO: train() with method='svmRadial'\n# TODO: tuneGrid for hyperparameter search\n# TODO: Print best params`,
            'SQL': `-- Pipeline concept (SQL)\n-- Preprocessing steps as CTEs\nWITH scaled AS (\n  SELECT *,\n    (sepal_length - AVG(sepal_length) OVER()) / STDDEV(sepal_length) OVER() AS sl_scaled\n  FROM iris\n),\nfeatures AS (\n  -- TODO: Add more scaled features\n  SELECT * FROM scaled\n)\nSELECT * FROM features;`,
          },
          solution:'Pipeline',
          validationRules:['Pipeline created','StandardScaler in pipe','SVC in pipe','GridSearchCV used','best_params_ printed'],
          tests:['Pipeline built','Grid search runs','Best params found','Score > 0.9','Preprocessing correct'] },

        { title:'Time Series', time:'45',
          desc:`<h3>Task 5: Time Series Forecasting</h3>`,
          starterCode:`import pandas as pd\nimport numpy as np\ndates = pd.date_range('2023-01-01', periods=365)\nsales = 1000 + np.arange(365)*2\nts = pd.Series(sales, index=dates)\n# TODO: Rolling mean, std, anomalies, forecast`,
          starterCodes: {
            'Python': `import pandas as pd\nimport numpy as np\ndates = pd.date_range('2023-01-01', periods=365)\nsales = 1000 + np.arange(365)*2 + np.random.randn(365)*50\nts = pd.Series(sales, index=dates)\n\n# TODO: ts.rolling(30).mean() for moving average\n# TODO: ts.rolling(30).std() for volatility\n# TODO: Flag anomalies where value > mean + 2*std\n# TODO: Simple linear forecast for next 30 days`,
            'R': `dates <- seq(as.Date('2023-01-01'), by='day', length.out=365)\nsales <- 1000 + 1:365*2 + rnorm(365, 0, 50)\nts_data <- ts(sales, frequency=365)\n\n# TODO: rollmean() from zoo package\n# TODO: Detect anomalies\n# TODO: HoltWinters() or auto.arima() forecast`,
            'SQL': `-- Time Series (SQL)\n-- Rolling statistics\nSELECT\n  date,\n  sales,\n  AVG(sales) OVER (ORDER BY date ROWS BETWEEN 29 PRECEDING AND CURRENT ROW) AS rolling_avg,\n  -- TODO: Rolling STDDEV\n  -- TODO: Flag anomalies\n  -- TODO: LAG/LEAD for forecast\nFROM sales_data\nORDER BY date;`,
          },
          solution:'rolling',
          validationRules:['rolling() used','std() computed','Anomaly detection','Forecast computed','DatetimeIndex used'],
          tests:['Rolling mean computed','Rolling std done','Anomalies flagged','Forecast produced','Date index handled'] },
      ],

      hard: [
        { title:'Deep Learning PyTorch', time:'60',
          desc:`<h3>Task 1: Neural Network from Scratch</h3>`,
          starterCode:`import torch\nimport torch.nn as nn\nX = torch.FloatTensor([[0,0],[0,1],[1,0],[1,1]])\ny = torch.FloatTensor([[0],[1],[1],[0]])\n# TODO: MLP class, train 1000 epochs`,
          starterCodes: {
            'Python': `import torch\nimport torch.nn as nn\nX = torch.FloatTensor([[0,0],[0,1],[1,0],[1,1]])\ny = torch.FloatTensor([[0],[1],[1],[0]])\n\nclass MLP(nn.Module):\n    def __init__(self):\n        super().__init__()\n        # TODO: Define layers\n    def forward(self, x):\n        # TODO: Forward pass\n        pass\n\nmodel = MLP()\n# TODO: Loss, optimizer, training loop 1000 epochs`,
            'R': `# Neural Network (R/keras)\nlibrary(keras)\nX <- matrix(c(0,0,0,1,1,0,1,1), ncol=2, byrow=TRUE)\ny <- c(0,1,1,0)\n\n# TODO: keras_model_sequential()\n# TODO: layer_dense() with relu\n# TODO: compile() with optimizer and loss\n# TODO: fit() for 1000 epochs`,
            'SQL': `-- Neural net is not typical SQL but prep data:\nSELECT\n  input1, input2, label,\n  -- TODO: Compute activations for simple perceptron\n  (0.5 * input1 + 0.5 * input2) AS weighted_sum\nFROM xor_data;`,
          },
          solution:'nn.Module',
          validationRules:['nn.Module subclass','forward() defined','optimizer.step() called','Loss computed','Accuracy printed'],
          tests:['Model defined','Forward pass works','Trains without error','Loss decreases','Accuracy > 90%'] },

        { title:'NLP Classification', time:'55',
          desc:`<h3>Task 2: Text Sentiment Classifier</h3>`,
          starterCode:`from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\ntexts = ['great product','terrible waste','amazing quality']\nlabels = [1,0,1]\n# TODO: TF-IDF + classifiers`,
          starterCodes: {
            'Python': `from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.svm import LinearSVC\ntexts = ['great product','terrible waste','amazing quality','awful experience','excellent service']\nlabels = [1,0,1,0,1]\n\n# TODO: TfidfVectorizer(ngram_range=(1,2))\n# TODO: Train MultinomialNB\n# TODO: Train LinearSVC\n# TODO: classification_report\n# TODO: Predict new text`,
            'R': `library(tm); library(e1071)\ntexts <- c('great product','terrible waste','amazing quality')\nlabels <- factor(c('pos','neg','pos'))\n\n# TODO: Corpus() and TDM\n# TODO: naiveBayes classifier\n# TODO: Predict and evaluate`,
            'SQL': `-- NLP prep (SQL)\n-- Word frequency as TF-IDF proxy\nSELECT\n  word,\n  COUNT(*) AS freq,\n  COUNT(*) * 1.0 / SUM(COUNT(*)) OVER() AS tf\nFROM (\n  -- TODO: Split text into words\n  SELECT UNNEST(STRING_TO_ARRAY(LOWER(text), ' ')) AS word\n  FROM reviews\n) words\nGROUP BY word\nORDER BY tf DESC;`,
          },
          solution:'TfidfVectorizer',
          validationRules:['TfidfVectorizer used','Two models trained','classification_report called','New prediction made','ngram_range set'],
          tests:['TF-IDF fitted','NB trained','SVC trained','Reports printed','Prediction made'] },

        { title:'Clustering & Anomaly', time:'50',
          desc:`<h3>Task 3: Unsupervised Learning</h3>`,
          starterCode:`from sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.decomposition import PCA\nimport numpy as np\nX = np.vstack([np.random.randn(100,4)+i for i in range(3)])\n# TODO: Scale, elbow, KMeans, DBSCAN, PCA`,
          starterCodes: {
            'Python': `from sklearn.cluster import KMeans, DBSCAN\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\nimport numpy as np\nX = np.vstack([np.random.randn(100,4)+i for i in range(3)])\n\n# TODO: StandardScaler().fit_transform(X)\n# TODO: Elbow: inertia for k=1..10\n# TODO: KMeans(n_clusters=3).fit()\n# TODO: DBSCAN(eps=0.5).fit()\n# TODO: PCA(n_components=2) for visualization`,
            'R': `X <- rbind(matrix(rnorm(400)+0,100,4), matrix(rnorm(400)+2,100,4), matrix(rnorm(400)+4,100,4))\n\n# TODO: scale(X)\n# TODO: kmeans(X, centers=3)\n# TODO: dbscan::dbscan(X, eps=0.5)\n# TODO: prcomp(X) for PCA`,
            'SQL': `-- Clustering prep (SQL)\n-- K-means centroids iteration\nWITH centroids AS (\n  -- TODO: Initialize random centroids\n  SELECT 1 AS k, AVG(x1) AS c1, AVG(x2) AS c2 FROM data\n)\n-- TODO: Assign points to nearest centroid\n-- TODO: Recompute centroids\nSELECT * FROM centroids;`,
          },
          solution:'KMeans',
          validationRules:['StandardScaler used','KMeans fitted','DBSCAN used','PCA applied','Inertia loop present'],
          tests:['Data scaled','Elbow plotted','Clusters found','Outliers detected','PCA 2D works'] },

        { title:'Model Explainability', time:'55',
          desc:`<h3>Task 4: SHAP & Feature Importance</h3>`,
          starterCode:`from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.inspection import permutation_importance\nfrom sklearn.datasets import load_breast_cancer\nX, y = load_breast_cancer(return_X_y=True)\n# TODO: Train, perm importance, top 3 features`,
          starterCodes: {
            'Python': `from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.inspection import permutation_importance, PartialDependenceDisplay\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nX, y = load_breast_cancer(return_X_y=True)\n\n# TODO: Train GBC\n# TODO: permutation_importance(model, X_test, y_test)\n# TODO: Print top 3 feature names\n# TODO: PartialDependenceDisplay for top feature`,
            'R': `library(randomForest); library(DALEX)\ndata(breast_cancer)\n\n# TODO: randomForest model\n# TODO: importance() and varImpPlot()\n# TODO: DALEX explainer\n# TODO: feature_importance() plot`,
            'SQL': `-- Feature importance proxy (SQL)\n-- Information gain approximation\nSELECT\n  feature_name,\n  CORR(feature_value, label) AS correlation,\n  ABS(CORR(feature_value, label)) AS importance\nFROM feature_table\nGROUP BY feature_name\nORDER BY importance DESC\nLIMIT 3;`,
          },
          solution:'GradientBoostingClassifier',
          validationRules:['GBC trained','permutation_importance called','Top features printed','PDP computed'],
          tests:['Model trained','Perm importance done','Top 3 features shown','PDP generated','Feature names used'] },

        { title:'Production ML Pipeline', time:'70',
          desc:`<h3>Task 5: Production ML Pipeline</h3>`,
          starterCode:`import pickle\nfrom sklearn.ensemble import RandomForestClassifier\n# TODO: Model v1 and v2\n# TODO: A/B test framework\n# TODO: Monitor for drift\n# TODO: Auto-retrain trigger`,
          starterCodes: {
            'Python': `import pickle\nfrom sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\n# TODO: Train model_v1 and model_v2\n# TODO: def ab_route(request_id) — 20% to v2\n# TODO: def predict_and_log(model, X) — log predictions\n# TODO: def detect_drift(recent_preds, baseline) — KS test\n# TODO: def should_retrain(drift_score) — trigger at 0.05`,
            'R': `library(randomForest); library(ks)\n\n# TODO: Train rf_v1 and rf_v2\n# TODO: AB routing function\n# TODO: Prediction logging\n# TODO: Drift detection with ks.test()\n# TODO: Auto-retrain trigger`,
            'SQL': `-- ML Pipeline monitoring (SQL)\nSELECT\n  DATE_TRUNC('day', predicted_at) AS day,\n  model_version,\n  AVG(prediction) AS avg_pred,\n  STDDEV(prediction) AS pred_std,\n  COUNT(*) AS n_predictions\n  -- TODO: Compare to baseline for drift detection\nFROM prediction_logs\nGROUP BY 1, 2\nORDER BY 1, 2;`,
          },
          solution:'pickle',
          validationRules:['Two model versions','A/B routing logic','Prediction logging','Retrain trigger','pickle.dump used'],
          tests:['v1 model trained','v2 model trained','A/B routing works','Logs predictions','Retrain triggers'] },
      ],
    },

    fin: {
      beginner: [
        { title:'P&L Statement', time:'25',
          desc:`<h3>Task 1: Profit & Loss Analysis</h3>`,
          starterCode:`// Task 1: P&L\nconst revenue = 1500000;\nconst cogs = 600000;\nconst opex = 350000;\nconst taxRate = 0.25;\n// TODO: Gross Profit, Gross Margin, Operating Income, Net Income`,
          starterCodes: {
            'Excel / VBA': `' Task 1: P&L (VBA)\nSub ProfitLoss()\n    Dim revenue As Double: revenue = 1500000\n    Dim cogs As Double: cogs = 600000\n    Dim opex As Double: opex = 350000\n    Dim taxRate As Double: taxRate = 0.25\n    \n    ' TODO: Calculate grossProfit = revenue - cogs\n    ' TODO: Calculate grossMargin = grossProfit / revenue\n    ' TODO: Calculate operatingIncome = grossProfit - opex\n    ' TODO: Calculate netIncome after tax\n    \n    Debug.Print "Net Income: " & netIncome\nEnd Sub`,
            'Python': `# P&L (Python)\nrevenue = 1_500_000\ncogs = 600_000\nopex = 350_000\ntax_rate = 0.25\n\n# TODO: gross_profit = revenue - cogs\n# TODO: gross_margin = gross_profit / revenue\n# TODO: operating_income = gross_profit - opex\n# TODO: net_income = operating_income * (1 - tax_rate)\n# TODO: Print all values`,
            'SQL': `-- P&L (SQL)\nWITH financials AS (\n  SELECT\n    1500000 AS revenue,\n    600000  AS cogs,\n    350000  AS opex,\n    0.25    AS tax_rate\n)\nSELECT\n  revenue,\n  revenue - cogs AS gross_profit,\n  -- TODO: gross_margin\n  -- TODO: operating_income\n  -- TODO: net_income\nFROM financials;`,
          },
          solution:'grossProfit',
          validationRules:['Gross profit calculated','Margins computed','Operating income found','Net income calculated'],
          tests:['Gross profit correct','Gross margin computed','Operating income right','Net income after tax','Net margin shown'] },

        { title:'Ratio Analysis', time:'30',
          desc:`<h3>Task 2: Financial Ratios</h3>`,
          starterCode:`// Task 2: Ratios\nconst currentAssets=500000,currentLiabilities=200000;\nconst inventory=150000,totalDebt=800000,equity=1200000;\nconst netIncome=180000,revenue=1500000;\n// TODO: Current Ratio, Quick Ratio, D/E, ROE, Net Margin`,
          starterCodes: {
            'Excel / VBA': `' Ratio Analysis (VBA)\nSub FinancialRatios()\n    Dim currentAssets As Double: currentAssets = 500000\n    Dim currentLiab As Double: currentLiab = 200000\n    Dim inventory As Double: inventory = 150000\n    Dim totalDebt As Double: totalDebt = 800000\n    Dim equity As Double: equity = 1200000\n    Dim netIncome As Double: netIncome = 180000\n    Dim revenue As Double: revenue = 1500000\n    \n    ' TODO: currentRatio = currentAssets / currentLiab\n    ' TODO: quickRatio = (currentAssets - inventory) / currentLiab\n    ' TODO: deRatio = totalDebt / equity\n    ' TODO: roe = netIncome / equity\n    ' TODO: netMargin = netIncome / revenue\nEnd Sub`,
            'Python': `# Financial Ratios (Python)\ncurrent_assets = 500_000\ncurrent_liab = 200_000\ninventory = 150_000\ntotal_debt = 800_000\nequity = 1_200_000\nnet_income = 180_000\nrevenue = 1_500_000\n\n# TODO: current_ratio = current_assets / current_liab\n# TODO: quick_ratio = (current_assets - inventory) / current_liab\n# TODO: de_ratio = total_debt / equity\n# TODO: roe = net_income / equity\n# TODO: net_margin = net_income / revenue`,
            'SQL': `-- Financial Ratios (SQL)\nSELECT\n  500000.0/200000 AS current_ratio,\n  -- TODO: quick_ratio\n  -- TODO: de_ratio\n  -- TODO: roe\n  -- TODO: net_margin\nFROM (SELECT 1) t;`,
          },
          solution:'currentRatio',
          validationRules:['Current ratio calculated','Quick ratio correct','D/E ratio computed','ROE calculated','Net margin found'],
          tests:['Current ratio > 0','Quick ratio correct','D/E ratio computed','ROE calculated','All 5 ratios printed'] },

        { title:'Cash Flow', time:'30',
          desc:`<h3>Task 3: Cash Flow Analysis</h3>`,
          starterCode:`// Task 3: Cash Flow\nconst items = [{name:'Net Income',amount:180000,type:'operating'},{name:'Equipment',amount:-150000,type:'investing'},{name:'Loan',amount:200000,type:'financing'}];\n// TODO: Sum each category, FCF, Net change`,
          starterCodes: {
            'Excel / VBA': `' Cash Flow (VBA)\nSub CashFlow()\n    ' Items: Net Income 180000 operating, Equipment -150000 investing, Loan 200000 financing\n    ' TODO: Sum operating items\n    ' TODO: Sum investing items\n    ' TODO: Sum financing items\n    ' TODO: FCF = operating + investing\n    ' TODO: Net change = all three\nEnd Sub`,
            'Python': `# Cash Flow (Python)\nitems = [\n    {'name':'Net Income','amount':180000,'type':'operating'},\n    {'name':'Depreciation','amount':45000,'type':'operating'},\n    {'name':'Equipment','amount':-150000,'type':'investing'},\n    {'name':'Loan','amount':200000,'type':'financing'}\n]\n\n# TODO: operating_cf = sum of operating items\n# TODO: investing_cf = sum of investing items\n# TODO: financing_cf = sum of financing items\n# TODO: fcf = operating_cf + investing_cf\n# TODO: net_change = operating_cf + investing_cf + financing_cf`,
            'SQL': `-- Cash Flow (SQL)\nSELECT\n  type,\n  SUM(amount) AS total\nFROM cash_flow_items\nGROUP BY type;\n\n-- TODO: FCF = SUM where type IN ('operating','investing')\n-- TODO: Net change = SUM of all`,
          },
          solution:'reduce',
          validationRules:['Operating CF summed','Investing CF summed','Financing CF summed','FCF calculated'],
          tests:['Operating CF correct','Investing CF correct','Financing CF correct','FCF computed','Net change right'] },

        { title:'Break-Even', time:'25',
          desc:`<h3>Task 4: Break-Even Analysis</h3>`,
          starterCode:`// Task 4: Break-Even\nconst fixedCosts=240000,sellingPrice=50,variableCost=30,currentSales=20000;\n// TODO: Contribution Margin, BEP units, BEP revenue, Margin of Safety`,
          starterCodes: {
            'Excel / VBA': `' Break-Even (VBA)\nSub BreakEven()\n    Dim fixedCosts As Double: fixedCosts = 240000\n    Dim sellingPrice As Double: sellingPrice = 50\n    Dim variableCost As Double: variableCost = 30\n    Dim currentSales As Long: currentSales = 20000\n    \n    ' TODO: contributionMargin = sellingPrice - variableCost\n    ' TODO: bepUnits = fixedCosts / contributionMargin\n    ' TODO: bepRevenue = bepUnits * sellingPrice\n    ' TODO: marginOfSafety = currentSales - bepUnits\nEnd Sub`,
            'Python': `# Break-Even (Python)\nfixed_costs = 240_000\nselling_price = 50\nvariable_cost = 30\ncurrent_sales = 20_000\n\n# TODO: contribution_margin = selling_price - variable_cost\n# TODO: bep_units = fixed_costs / contribution_margin\n# TODO: bep_revenue = bep_units * selling_price\n# TODO: margin_of_safety = current_sales - bep_units\n# TODO: mos_pct = margin_of_safety / current_sales`,
            'SQL': `-- Break-Even (SQL)\nWITH inputs AS (\n  SELECT 240000 AS fixed_costs, 50 AS price, 30 AS var_cost, 20000 AS sales\n)\nSELECT\n  price - var_cost AS contribution_margin,\n  -- TODO: bep_units\n  -- TODO: bep_revenue\n  -- TODO: margin_of_safety\nFROM inputs;`,
          },
          solution:'breakEven',
          validationRules:['Contribution margin','Break-even units','Break-even revenue','Margin of safety'],
          tests:['Contribution margin correct','BEP units right','BEP revenue right','Margin of safety found','% margin of safety'] },
      ],

      intermediate: [
        { title:'DCF Valuation', time:'45',
          desc:`<h3>Task 1: Discounted Cash Flow Model</h3>`,
          starterCode:`// DCF\nconst fcf=[500000,550000,605000,665500,732050];\nconst wacc=0.10,g=0.03,shares=1000000;\n// TODO: PV of FCF, Terminal Value, Enterprise Value, Per Share`,
          starterCodes: {
            'Excel / VBA': `' DCF (VBA)\nSub DCFValuation()\n    Dim fcf(4) As Double\n    fcf(0)=500000: fcf(1)=550000: fcf(2)=605000: fcf(3)=665500: fcf(4)=732050\n    Dim wacc As Double: wacc = 0.10\n    Dim g As Double: g = 0.03\n    Dim shares As Long: shares = 1000000\n    Dim pvFCF As Double: pvFCF = 0\n    Dim i As Integer\n    ' TODO: PV each FCF: pvFCF += fcf(i) / (1+wacc)^(i+1)\n    ' TODO: Terminal Value = fcf(4) * (1+g) / (wacc-g)\n    ' TODO: PV of TV = TV / (1+wacc)^5\n    ' TODO: Enterprise Value = pvFCF + pvTV\n    ' TODO: Per share = EV / shares\nEnd Sub`,
            'Python': `# DCF Valuation (Python)\nfcf = [500000, 550000, 605000, 665500, 732050]\nwacc = 0.10\ng = 0.03\nshares = 1_000_000\n\n# TODO: pv_fcf = sum(fcf[i] / (1+wacc)**(i+1) for i in range(5))\n# TODO: terminal_value = fcf[-1] * (1+g) / (wacc - g)\n# TODO: pv_tv = terminal_value / (1+wacc)**5\n# TODO: enterprise_value = pv_fcf + pv_tv\n# TODO: per_share = enterprise_value / shares`,
            'SQL': `-- DCF (SQL)\nWITH fcf AS (\n  SELECT 1 AS yr, 500000 AS cashflow UNION ALL\n  SELECT 2, 550000 UNION ALL\n  SELECT 3, 605000 UNION ALL\n  SELECT 4, 665500 UNION ALL\n  SELECT 5, 732050\n)\nSELECT\n  SUM(cashflow / POWER(1.10, yr)) AS pv_fcf\n  -- TODO: terminal_value CTE\n  -- TODO: enterprise_value\n  -- TODO: per_share\nFROM fcf;`,
          },
          solution:'Math.pow',
          validationRules:['PV calculated','Terminal value computed','Enterprise value summed','Per share value found','WACC applied'],
          tests:['PV of FCF correct','TV calculated','PV(TV) discounted','Enterprise value right','Per share intrinsic value'] },

        { title:'Portfolio Analysis', time:'45',
          desc:`<h3>Task 2: Modern Portfolio Theory</h3>`,
          starterCode:`// Portfolio\nconst assets=[{weight:0.3,return:0.12,std:0.18},{weight:0.4,return:0.15,std:0.22},{weight:0.3,return:0.10,std:0.14}];\nconst riskFree=0.06;\n// TODO: Expected return, variance, std dev, Sharpe`,
          starterCodes: {
            'Excel / VBA': `' Portfolio (VBA)\nSub PortfolioAnalysis()\n    Dim w(2) As Double: w(0)=0.3: w(1)=0.4: w(2)=0.3\n    Dim r(2) As Double: r(0)=0.12: r(1)=0.15: r(2)=0.10\n    Dim s(2) As Double: s(0)=0.18: s(1)=0.22: s(2)=0.14\n    Dim riskFree As Double: riskFree = 0.06\n    ' TODO: expectedReturn = sum of w(i) * r(i)\n    ' TODO: variance = sum of (w(i) * s(i))^2\n    ' TODO: portStd = Sqr(variance)\n    ' TODO: sharpe = (expectedReturn - riskFree) / portStd\nEnd Sub`,
            'Python': `# Portfolio Analysis (Python)\nimport numpy as np\nweights = np.array([0.3, 0.4, 0.3])\nreturns = np.array([0.12, 0.15, 0.10])\nstds = np.array([0.18, 0.22, 0.14])\nrisk_free = 0.06\n\n# TODO: expected_return = np.dot(weights, returns)\n# TODO: variance = np.dot(weights**2, stds**2)\n# TODO: port_std = np.sqrt(variance)\n# TODO: sharpe = (expected_return - risk_free) / port_std`,
            'SQL': `-- Portfolio (SQL)\nWITH assets AS (\n  SELECT 0.3 AS w, 0.12 AS r, 0.18 AS s UNION ALL\n  SELECT 0.4, 0.15, 0.22 UNION ALL\n  SELECT 0.3, 0.10, 0.14\n)\nSELECT\n  SUM(w * r) AS expected_return,\n  -- TODO: variance = SUM(w*w * s*s)\n  -- TODO: port_std = SQRT(variance)\n  -- TODO: sharpe = (expected_return - 0.06) / port_std\nFROM assets;`,
          },
          solution:'sharpe',
          validationRules:['Expected return weighted','Variance computed','Std deviation found','Sharpe ratio calculated'],
          tests:['Portfolio return correct','Variance computed','Std dev found','Sharpe ratio right','Covariance used'] },

        { title:'Revenue Forecasting', time:'50',
          desc:`<h3>Task 3: Revenue Forecasting Model</h3>`,
          starterCode:`// Forecast\nconst base=10000000;\nconst growth=[0.12,0.15,0.08,0.18,0.11];\n// TODO: Bear/Base/Bull scenarios, Monte Carlo 1000 sims, P10/P50/P90`,
          starterCodes: {
            'Excel / VBA': `' Revenue Forecast (VBA)\nSub RevenueForecast()\n    Dim base As Double: base = 10000000\n    Dim i As Integer\n    Dim results(999) As Double\n    ' TODO: Bear scenario (growth * 0.7)\n    ' TODO: Base scenario (growth as-is)\n    ' TODO: Bull scenario (growth * 1.3)\n    ' TODO: Monte Carlo: 1000 simulations\n    ' TODO: Sort and find P10, P50, P90\nEnd Sub`,
            'Python': `# Revenue Forecast (Python)\nimport numpy as np\nbase = 10_000_000\ngrowth = [0.12, 0.15, 0.08, 0.18, 0.11]\n\ndef forecast(base, rates, scenario_mult=1.0):\n    rev = base\n    # TODO: Apply each rate * scenario_mult\n    return rev\n\n# TODO: bear = forecast(base, growth, 0.7)\n# TODO: base_case = forecast(base, growth, 1.0)\n# TODO: bull = forecast(base, growth, 1.3)\n\n# Monte Carlo\nresults = []\nfor _ in range(1000):\n    # TODO: Random growth rates, simulate 5-year revenue\n    pass\n\n# TODO: P10, P50, P90 = np.percentile(results, [10, 50, 90])`,
            'SQL': `-- Revenue Forecast (SQL)\nWITH RECURSIVE forecast AS (\n  SELECT 1 AS yr, 10000000.0 AS revenue, 1.12 AS growth\n  UNION ALL\n  SELECT yr+1, revenue * growth, growth\n  FROM forecast WHERE yr < 5\n)\nSELECT yr, revenue,\n  revenue * 0.7 AS bear,\n  revenue AS base_case,\n  revenue * 1.3 AS bull\nFROM forecast;`,
          },
          solution:'Math.random',
          validationRules:['Three scenarios','5-year forecast','Monte Carlo loop','Percentiles computed'],
          tests:['Bear scenario','Base scenario','Bull scenario','1000 simulations','P10/P50/P90 shown'] },

        { title:'Working Capital', time:'40',
          desc:`<h3>Task 4: Working Capital Optimization</h3>`,
          starterCode:`// Working Capital\nconst revenue=5000000,cogs=3000000;\nconst inventory=400000,receivables=600000,payables=350000;\n// TODO: DIO, DSO, DPO, CCC, Cash savings`,
          starterCodes: {
            'Excel / VBA': `' Working Capital (VBA)\nSub WorkingCapital()\n    Dim revenue As Double: revenue = 5000000\n    Dim cogs As Double: cogs = 3000000\n    Dim inventory As Double: inventory = 400000\n    Dim receivables As Double: receivables = 600000\n    Dim payables As Double: payables = 350000\n    ' TODO: DIO = inventory / cogs * 365\n    ' TODO: DSO = receivables / revenue * 365\n    ' TODO: DPO = payables / cogs * 365\n    ' TODO: CCC = DIO + DSO - DPO\n    ' TODO: Cash savings if CCC reduced by 5 days\nEnd Sub`,
            'Python': `# Working Capital (Python)\nrevenue = 5_000_000\ncogs = 3_000_000\ninventory = 400_000\nreceivables = 600_000\npayables = 350_000\n\n# TODO: dio = inventory / cogs * 365\n# TODO: dso = receivables / revenue * 365\n# TODO: dpo = payables / cogs * 365\n# TODO: ccc = dio + dso - dpo\n# TODO: savings = (revenue / 365) * 5`,
            'SQL': `-- Working Capital (SQL)\nSELECT\n  inventory * 365.0 / cogs AS dio,\n  receivables * 365.0 / revenue AS dso,\n  payables * 365.0 / cogs AS dpo,\n  -- TODO: CCC = DIO + DSO - DPO\n  -- TODO: savings if CCC reduced by 5 days\nFROM (\n  SELECT 5000000 revenue, 3000000 cogs, 400000 inventory, 600000 receivables, 350000 payables\n) t;`,
          },
          solution:'CCC',
          validationRules:['DIO calculated','DSO calculated','DPO calculated','CCC computed','Savings modeled'],
          tests:['DIO correct','DSO correct','DPO correct','CCC computed','Savings calculated'] },

        { title:'M&A Analysis', time:'55',
          desc:`<h3>Task 5: M&A Accretion/Dilution</h3>`,
          starterCode:`// M&A\nconst acquirer={eps:5.00,shares:100e6,ni:500e6};\nconst target={ni:80e6,synergies:20e6};\nconst price=1200e6,debtPct=0.5,rate=0.06,newShares=20e6,tax=0.25;\n// TODO: Combined NI, new shares, new EPS, accretion/dilution %`,
          starterCodes: {
            'Excel / VBA': `' M&A (VBA)\nSub MAAnalysis()\n    Dim acqEPS As Double: acqEPS = 5.0\n    Dim acqShares As Double: acqShares = 100000000\n    Dim acqNI As Double: acqNI = 500000000\n    Dim targetNI As Double: targetNI = 80000000\n    Dim synergies As Double: synergies = 20000000\n    Dim price As Double: price = 1200000000\n    Dim debtPct As Double: debtPct = 0.5\n    Dim rate As Double: rate = 0.06\n    Dim newShares As Double: newShares = 20000000\n    Dim tax As Double: tax = 0.25\n    ' TODO: debtFinanced = price * debtPct\n    ' TODO: interestCost = debtFinanced * rate * (1 - tax)\n    ' TODO: combinedNI = acqNI + targetNI + synergies - interestCost\n    ' TODO: totalShares = acqShares + newShares\n    ' TODO: newEPS = combinedNI / totalShares\n    ' TODO: accretion = (newEPS - acqEPS) / acqEPS\nEnd Sub`,
            'Python': `# M&A Analysis (Python)\nacq = {'eps': 5.0, 'shares': 100e6, 'ni': 500e6}\ntarget = {'ni': 80e6, 'synergies': 20e6}\nprice = 1_200e6\ndebt_pct = 0.5\nrate = 0.06\nnew_shares = 20e6\ntax = 0.25\n\n# TODO: debt_financed = price * debt_pct\n# TODO: interest_cost = debt_financed * rate * (1 - tax)\n# TODO: combined_ni = acq['ni'] + target['ni'] + target['synergies'] - interest_cost\n# TODO: total_shares = acq['shares'] + new_shares\n# TODO: new_eps = combined_ni / total_shares\n# TODO: accretion = (new_eps - acq['eps']) / acq['eps']`,
            'SQL': `-- M&A (SQL)\nWITH inputs AS (\n  SELECT 500e6 AS acq_ni, 80e6 AS target_ni, 20e6 AS synergies,\n         1200e6 AS price, 0.5 AS debt_pct, 0.06 AS rate,\n         100e6 AS acq_shares, 20e6 AS new_shares, 0.25 AS tax, 5.0 AS acq_eps\n)\nSELECT\n  price * debt_pct * rate * (1-tax) AS interest_cost,\n  -- TODO: combined_ni\n  -- TODO: new_eps\n  -- TODO: accretion_pct\nFROM inputs;`,
          },
          solution:'accretion',
          validationRules:['Combined income','Interest cost','New shares count','New EPS','Accretion/dilution %'],
          tests:['Combined NI right','After-tax interest','New share count','New EPS computed','Accretion/dilution shown'] },
      ],

      hard: [
        { title:'Options Pricing', time:'60',
          desc:`<h3>Task 1: Black-Scholes Model</h3>`,
          starterCode:`// Black-Scholes\nconst S=100,K=105,T=0.5,r=0.05,sigma=0.2;\nfunction normalCDF(x){const a1=0.254829592,p=0.3275911;const t=1/(1+p*Math.abs(x));return 0.5*(1+Math.sign(x||1)*(1-(a1*t)*Math.exp(-x*x/2)));}\n// TODO: d1, d2, call price, put price, delta`,
          starterCodes: {
            'Excel / VBA': `' Black-Scholes (VBA)\nFunction NormCDF(x As Double) As Double\n    NormCDF = Application.NormSDist(x)\nEnd Function\n\nSub BlackScholes()\n    Dim S As Double: S = 100\n    Dim K As Double: K = 105\n    Dim T As Double: T = 0.5\n    Dim r As Double: r = 0.05\n    Dim sigma As Double: sigma = 0.2\n    ' TODO: d1 = (Log(S/K) + (r + sigma^2/2)*T) / (sigma * Sqr(T))\n    ' TODO: d2 = d1 - sigma * Sqr(T)\n    ' TODO: callPrice = S*NormCDF(d1) - K*Exp(-r*T)*NormCDF(d2)\n    ' TODO: putPrice = K*Exp(-r*T)*NormCDF(-d2) - S*NormCDF(-d1)\n    ' TODO: delta = NormCDF(d1)\nEnd Sub`,
            'Python': `# Black-Scholes (Python)\nimport numpy as np\nfrom scipy.stats import norm\n\nS, K, T, r, sigma = 100, 105, 0.5, 0.05, 0.2\n\n# TODO: d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma * np.sqrt(T))\n# TODO: d2 = d1 - sigma * np.sqrt(T)\n# TODO: call = S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)\n# TODO: put = K*np.exp(-r*T)*norm.cdf(-d2) - S*norm.cdf(-d1)\n# TODO: delta = norm.cdf(d1)`,
            'SQL': `-- Black-Scholes approximation (SQL)\n-- Uses erf approximation for normal CDF\nWITH params AS (\n  SELECT 100.0 AS S, 105.0 AS K, 0.5 AS T, 0.05 AS r, 0.2 AS sigma\n),\nd_values AS (\n  SELECT\n    (LN(S/K) + (r + sigma*sigma/2)*T) / (sigma * SQRT(T)) AS d1,\n    (LN(S/K) + (r + sigma*sigma/2)*T) / (sigma * SQRT(T)) - sigma*SQRT(T) AS d2\n  FROM params\n)\n-- TODO: Compute call and put using normal CDF approximation\nSELECT d1, d2 FROM d_values;`,
          },
          solution:'normalCDF',
          validationRules:['d1 formula','d2 formula','Call price computed','Put price computed','Delta calculated'],
          tests:['d1 correct','d2 correct','Call price within range','Put-call parity holds','Delta in [0,1]'] },

        { title:'VaR Risk Management', time:'55',
          desc:`<h3>Task 2: Value at Risk</h3>`,
          starterCode:`// VaR\nconst pv=10000000;\nconst returns=Array.from({length:252},()=>(Math.random()-0.5)*0.02);\n// TODO: Historical VaR, Parametric VaR, CVaR, Stress test`,
          starterCodes: {
            'Excel / VBA': `' VaR (VBA)\nSub ValueAtRisk()\n    Dim pv As Double: pv = 10000000\n    ' TODO: Generate 252 random returns\n    ' TODO: Sort returns ascending\n    ' TODO: Historical VaR at 5th percentile\n    ' TODO: Parametric VaR = pv * (mean - 1.645 * std)\n    ' TODO: CVaR = average of worst 5%\nEnd Sub`,
            'Python': `# VaR (Python)\nimport numpy as np\npv = 10_000_000\nreturns = np.random.normal(0, 0.01, 252)\n\n# TODO: Sort returns\n# TODO: historical_var = pv * abs(np.percentile(returns, 5))\n# TODO: parametric_var = pv * (np.mean(returns) - 1.645 * np.std(returns)) * -1\n# TODO: cvar = pv * abs(np.mean(returns[returns <= np.percentile(returns, 5)]))\n# TODO: stress_test: apply -20% shock`,
            'SQL': `-- VaR (SQL)\nWITH returns AS (\n  SELECT val, ROW_NUMBER() OVER (ORDER BY val) AS rn, COUNT(*) OVER () AS total\n  FROM daily_returns\n),\nvar_5pct AS (\n  SELECT AVG(val) AS historical_var\n  FROM returns\n  WHERE rn <= CEIL(total * 0.05)\n)\nSELECT\n  historical_var * -10000000 AS var_dollar\n  -- TODO: parametric_var\n  -- TODO: cvar\nFROM var_5pct;`,
          },
          solution:'VaR',
          validationRules:['Historical VaR','Parametric VaR','CVaR computed','Stress test defined'],
          tests:['Historical VaR correct','Parametric VaR correct','CVaR computed','Returns sorted','Stress test run'] },

        { title:'Bond Analytics', time:'65',
          desc:`<h3>Task 3: Bond Pricing & Duration</h3>`,
          starterCode:`// Bond\nconst face=1000,coupon=0.06,maturity=10,ytm=0.07;\n// TODO: Bond price, Macaulay Duration, Modified Duration, Convexity, DV01`,
          starterCodes: {
            'Excel / VBA': `' Bond Analytics (VBA)\nSub BondAnalytics()\n    Dim face As Double: face = 1000\n    Dim coupon As Double: coupon = 0.06\n    Dim maturity As Integer: maturity = 10\n    Dim ytm As Double: ytm = 0.07\n    Dim c As Double: c = face * coupon\n    ' TODO: Bond price = PV of coupons + PV of face\n    ' TODO: Macaulay Duration = weighted avg time of cash flows\n    ' TODO: Modified Duration = MacD / (1 + ytm)\n    ' TODO: DV01 = Modified Duration * Price / 10000\nEnd Sub`,
            'Python': `# Bond Analytics (Python)\nimport numpy as np\nface = 1000\ncoupon = 0.06\nmaturity = 10\nytm = 0.07\nc = face * coupon\n\n# TODO: price = sum(c/(1+ytm)**t for t in range(1,11)) + face/(1+ytm)**10\n# TODO: mac_duration = sum(t * (c/(1+ytm)**t) / price for t in range(1,11))\n#                     + 10 * (face/(1+ytm)**10) / price\n# TODO: mod_duration = mac_duration / (1 + ytm)\n# TODO: convexity = sum(t*(t+1)*(c/(1+ytm)**(t+2)) for t in range(1,11)) / price\n# TODO: dv01 = mod_duration * price / 10000`,
            'SQL': `-- Bond Analytics (SQL)\nWITH cashflows AS (\n  SELECT generate_series(1, 10) AS t, 60.0 AS coupon, 1000.0 AS face, 0.07 AS ytm\n),\npv AS (\n  SELECT\n    t,\n    coupon / POWER(1+ytm, t) AS pv_coupon,\n    CASE WHEN t=10 THEN face / POWER(1+ytm, t) ELSE 0 END AS pv_face\n  FROM cashflows\n)\nSELECT\n  SUM(pv_coupon + pv_face) AS bond_price\n  -- TODO: Macaulay duration\n  -- TODO: Modified duration\nFROM pv;`,
          },
          solution:'bondPrice',
          validationRules:['Bond price computed','Macaulay duration','Modified duration','Convexity calculated','DV01 found'],
          tests:['Bond priced correctly','Macaulay duration right','Modified duration right','Convexity computed','DV01 correct'] },

        { title:'Algo Trading', time:'70',
          desc:`<h3>Task 4: Backtest Trading Strategy</h3>`,
          starterCode:`// Algo\nconst prices=Array.from({length:252},(_,i)=>100+i*0.05+Math.sin(i*0.3)*5);\n// TODO: 20-day SMA, Bollinger Bands, signals, backtest PnL, Sharpe, drawdown`,
          starterCodes: {
            'Excel / VBA': `' Algo Trading (VBA)\nSub AlgoTrading()\n    Dim n As Integer: n = 252\n    Dim prices(251) As Double\n    Dim i As Integer\n    For i = 0 To n-1\n        prices(i) = 100 + i*0.05 + Sin(i*0.3)*5\n    Next i\n    ' TODO: 20-day SMA array\n    ' TODO: Bollinger Bands (SMA ± 2*std)\n    ' TODO: Generate buy/sell signals\n    ' TODO: Backtest PnL\n    ' TODO: Sharpe ratio and max drawdown\nEnd Sub`,
            'Python': `# Algo Trading (Python)\nimport numpy as np\nprices = np.array([100 + i*0.05 + np.sin(i*0.3)*5 for i in range(252)])\n\n# TODO: sma20 = pd.Series(prices).rolling(20).mean()\n# TODO: std20 = pd.Series(prices).rolling(20).std()\n# TODO: upper_band = sma20 + 2*std20, lower_band = sma20 - 2*std20\n# TODO: signals: buy when price < lower, sell when price > upper\n# TODO: pnl = simulate trades\n# TODO: sharpe = pnl.mean() / pnl.std() * sqrt(252)\n# TODO: max_drawdown = (cummax - cumulative).max()`,
            'SQL': `-- Algo Trading (SQL)\nWITH prices AS (\n  SELECT generate_series(1,252) AS t,\n         100 + generate_series(1,252)*0.05 AS price\n),\nsma AS (\n  SELECT t, price,\n    AVG(price) OVER (ORDER BY t ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS sma20,\n    STDDEV(price) OVER (ORDER BY t ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS std20\n  FROM prices\n)\nSELECT\n  t, price, sma20,\n  sma20 + 2*std20 AS upper_band,\n  sma20 - 2*std20 AS lower_band\n  -- TODO: Signal column\n  -- TODO: Cumulative PnL\nFROM sma;`,
          },
          solution:'SMA',
          validationRules:['SMA computed','Bollinger bands','Buy/sell signals','PnL tracked','Sharpe computed'],
          tests:['SMA calculated','Bands computed','Signals generated','PnL tracked','Sharpe ratio found'] },

        { title:'Structured Finance', time:'75',
          desc:`<h3>Task 5: CDO/ABS Waterfall</h3>`,
          starterCode:`// Waterfall\nconst pool=100000000;\nconst tranches=[{name:'Senior',bal:65e6,coupon:0.04},{name:'Mezz',bal:20e6,coupon:0.06},{name:'Junior',bal:10e6,coupon:0.09},{name:'Equity',bal:5e6,coupon:0}];\n// TODO: Net cashflow, waterfall, OC test, IC test, stress scenario`,
          starterCodes: {
            'Excel / VBA': `' Waterfall (VBA)\nSub Waterfall()\n    Dim pool As Double: pool = 100000000\n    ' Tranches: Senior 65M 4%, Mezz 20M 6%, Junior 10M 9%, Equity 5M 0%\n    ' TODO: grossCF = pool * 0.08\n    ' TODO: expenses = pool * 0.005\n    ' TODO: netCF = grossCF - expenses\n    ' TODO: Pay Senior first, then Mezz, Junior, Equity\n    ' TODO: OC test: pool / (senior + mezz) > 1.25\n    ' TODO: IC test: netCF / seniorInterest > 1.5\nEnd Sub`,
            'Python': `# Waterfall (Python)\npool = 100_000_000\ntranches = [\n    {'name':'Senior','bal':65e6,'coupon':0.04},\n    {'name':'Mezz','bal':20e6,'coupon':0.06},\n    {'name':'Junior','bal':10e6,'coupon':0.09},\n    {'name':'Equity','bal':5e6,'coupon':0}\n]\n\n# TODO: gross_cf = pool * 0.08\n# TODO: expenses = pool * 0.005\n# TODO: net_cf = gross_cf - expenses\n# TODO: Distribute net_cf to tranches in order (waterfall)\n# TODO: oc_test = pool / (tranches[0]['bal'] + tranches[1]['bal']) > 1.25\n# TODO: ic_test = net_cf / (tranches[0]['bal'] * tranches[0]['coupon']) > 1.5\n# TODO: Stress: pool defaults 20%, rerun waterfall`,
            'SQL': `-- Waterfall (SQL)\nWITH cashflows AS (\n  SELECT\n    100000000 * 0.08 AS gross_cf,\n    100000000 * 0.005 AS expenses\n),\nnet AS (\n  SELECT gross_cf - expenses AS net_cf FROM cashflows\n),\nsenior_pay AS (\n  SELECT LEAST(net_cf, 65000000 * 0.04) AS senior_interest\n  FROM net\n)\n-- TODO: Mezz payment after senior\n-- TODO: Junior payment\n-- TODO: Equity residual\n-- TODO: OC and IC tests\nSELECT * FROM senior_pay;`,
          },
          solution:'waterfall',
          validationRules:['Net cashflow computed','Waterfall distribution','OC test implemented','IC test implemented','Stress scenario run'],
          tests:['Net cashflow right','Senior paid first','OC test correct','IC test correct','Stress scenario run'] },
      ],
    },

    ai: {
      beginner: [
        { title:'Prompt Engineering', time:'20',
          desc:`<h3>Task 1: Prompt Engineering Basics</h3>`,
          starterCode:`// Prompts\nconst zeroShot = \`TODO: sentiment classification prompt\`;\nconst fewShot = \`TODO: 3 examples then question\`;\nconst cot = \`TODO: step by step reasoning prompt\`;`,
          starterCodes: {
            // FIX: was broken — stray semicolon after closing backtick inside object literal
            'JavaScript': `// Prompt Engineering (JavaScript)\nconst zeroShot = \`Classify the sentiment of this text as positive, negative, or neutral:\n"I love this product!"\nSentiment: TODO\`;\n\nconst fewShot = \`Examples:\n"Great quality" → positive\n"Terrible service" → negative\n"It's okay" → neutral\n\nNow classify: "The delivery was fast but packaging was damaged"\nSentiment: TODO\`;\n\nconst cot = \`Let's think step by step.\nText: "The product works but setup took 3 hours"\n1. TODO: Identify positive aspects\n2. TODO: Identify negative aspects\n3. TODO: Weigh and conclude\`;`,
            'Python': `# Prompt Engineering (Python)\nzero_shot = """Classify the sentiment of this text as positive, negative, or neutral:\n"{text}"\nSentiment: """\n\nfew_shot = """Examples:\n"Great quality" → positive\n"Terrible service" → negative\n"It is okay" → neutral\n\nNow classify: "{text}"\nSentiment: TODO"""\n\ncot = """Let's think step by step.\nText: "{text}"\n1. TODO: Identify positive aspects\n2. TODO: Identify negative aspects  \n3. TODO: Balance and conclude\nFinal sentiment: TODO"""`,
            'SQL': `-- Prompt templates stored in SQL\nCREATE TABLE prompt_templates (\n  name VARCHAR(50),\n  template TEXT,\n  type VARCHAR(20)\n);\n\n-- TODO: Insert zero_shot template\n-- TODO: Insert few_shot template with 3 examples\n-- TODO: Insert chain_of_thought template\n-- TODO: Query to fill template with dynamic text`,
          },
          solution:'step by step',
          validationRules:['Zero-shot prompt defined','Few-shot examples present','Chain-of-thought included','Prompts non-empty'],
          tests:['Zero-shot defined','3 few-shot examples','CoT phrase present','Prompts non-empty','Task descriptions clear'] },

        { title:'API Integration', time:'25',
          desc:`<h3>Task 2: LLM API Integration</h3>`,
          starterCode:`async function callLLM(prompt) {\n  // TODO: POST to API\n}\nasync function retryWithBackoff(fn, maxRetries=3) {\n  // TODO: exponential backoff\n}\nmodule.exports = {callLLM, retryWithBackoff};`,
          starterCodes: {
            // FIX: was broken — the JavaScript value had };, (object property ending with semicolon)
            'JavaScript': `// LLM API Integration (JavaScript)\nasync function callLLM(prompt, model = 'gpt-3.5-turbo') {\n  // TODO: fetch('https://api.openai.com/v1/chat/completions')\n  // TODO: Set Authorization header\n  // TODO: Return response text\n}\n\nasync function retryWithBackoff(fn, maxRetries = 3) {\n  // TODO: Try fn(), on error wait 2^attempt * 1000ms\n  // TODO: Throw after maxRetries\n}\n\nmodule.exports = { callLLM, retryWithBackoff };`,
            'Python': `# LLM API Integration (Python)\nimport asyncio\nimport aiohttp\n\nasync def call_llm(prompt: str, model: str = 'gpt-3.5-turbo') -> str:\n    # TODO: aiohttp POST to OpenAI API\n    # TODO: Return response text\n    pass\n\nasync def retry_with_backoff(fn, max_retries: int = 3):\n    # TODO: Try fn(), on error wait 2**attempt seconds\n    # TODO: Raise after max_retries\n    pass`,
            'SQL': `-- API call logging (SQL)\nCREATE TABLE api_calls (\n  id SERIAL PRIMARY KEY,\n  prompt TEXT,\n  response TEXT,\n  model VARCHAR(50),\n  tokens_used INT,\n  latency_ms INT,\n  retries INT DEFAULT 0,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: INSERT on each call\n-- TODO: SELECT avg latency, total tokens\n-- TODO: Flag calls with retries > 0`,
          },
          solution:'async function callLLM',
          validationRules:['callLLM defined','async/await used','retry logic present','Error handling included'],
          tests:['Function defined','Async/await used','Retry implemented','Exponential backoff','Error handled'] },

        { title:'Embeddings & Similarity', time:'30',
          desc:`<h3>Task 3: Text Embeddings & Semantic Search</h3>`,
          starterCode:`function getMockEmbedding(text){const h=text.split('').reduce((a,c)=>a+c.charCodeAt(0),0);return Array.from({length:8},(_,i)=>Math.sin(h+i));}\n// TODO: cosineSimilarity(a,b)\n// TODO: semanticSearch(query, docs)\n// TODO: findDuplicates(docs, threshold)`,
          starterCodes: {
            'JavaScript': `// Embeddings (JavaScript)\nfunction getMockEmbedding(text) {\n  const h = text.split('').reduce((a,c) => a + c.charCodeAt(0), 0);\n  return Array.from({length:8}, (_,i) => Math.sin(h+i));\n}\n\nfunction cosineSimilarity(a, b) {\n  // TODO: dot(a,b) / (magnitude(a) * magnitude(b))\n}\n\nfunction semanticSearch(query, docs, k=3) {\n  // TODO: Embed query, compute similarity to all docs, return top k\n}\n\nfunction findDuplicates(docs, threshold=0.95) {\n  // TODO: Return pairs with similarity > threshold\n}\n\nmodule.exports = { cosineSimilarity, semanticSearch, findDuplicates };`,
            'Python': `# Embeddings (Python)\nimport numpy as np\n\ndef get_mock_embedding(text: str) -> np.ndarray:\n    h = sum(ord(c) for c in text)\n    return np.array([np.sin(h + i) for i in range(8)])\n\ndef cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:\n    # TODO: np.dot(a,b) / (norm(a) * norm(b))\n    pass\n\ndef semantic_search(query: str, docs: list, k: int = 3) -> list:\n    # TODO: Embed all, rank by cosine similarity\n    pass\n\ndef find_duplicates(docs: list, threshold: float = 0.95) -> list:\n    # TODO: All pairs above threshold\n    pass`,
            'SQL': `-- Similarity search (SQL / pgvector style)\nCREATE TABLE documents (\n  id SERIAL PRIMARY KEY,\n  content TEXT,\n  embedding FLOAT8[]\n);\n\n-- TODO: Cosine similarity function\nCREATE OR REPLACE FUNCTION cosine_sim(a FLOAT8[], b FLOAT8[])\nRETURNS FLOAT8 AS $$\n  -- TODO: dot product / (magnitude_a * magnitude_b)\n$$ LANGUAGE plpgsql;\n\n-- TODO: SELECT top 3 similar docs for a query embedding`,
          },
          solution:'cosineSimilarity',
          validationRules:['cosineSimilarity defined','Dot product computed','Magnitude calculated','semanticSearch implemented'],
          tests:['Cosine similarity correct','Similarity in [0,1]','Top 3 returned','Finance docs ranked higher','Duplicates detected'] },

        { title:'RAG Pipeline', time:'30',
          desc:`<h3>Task 4: Basic RAG Pipeline</h3>`,
          starterCode:`const docs=["SimWork helps freshers","The platform offers 4 tracks","Users earn certificates"];\n// TODO: chunkDocument(doc, size)\n// TODO: buildIndex(docs)\n// TODO: retrieve(query, index, k)\n// TODO: augmentedPrompt(query, chunks)`,
          starterCodes: {
            'JavaScript': `// RAG Pipeline (JavaScript)\nconst docs = ["SimWork helps freshers get job-ready", "The platform offers 4 simulation tracks", "Users earn verifiable certificates on completion"];\n\nfunction chunkDocument(doc, chunkSize = 50) {\n  // TODO: Split doc into overlapping chunks of chunkSize words\n}\n\nfunction buildIndex(docs) {\n  // TODO: Chunk all docs, return array of {chunk, docId}\n}\n\nfunction retrieve(query, index, k = 3) {\n  // TODO: Find top-k chunks by keyword/embedding similarity\n}\n\nfunction augmentedPrompt(query, chunks) {\n  // TODO: Build prompt with context + question\n}\n\nmodule.exports = { chunkDocument, buildIndex, retrieve, augmentedPrompt };`,
            'Python': `# RAG Pipeline (Python)\ndocs = ["SimWork helps freshers get job-ready", "The platform offers 4 simulation tracks", "Users earn verifiable certificates on completion"]\n\ndef chunk_document(doc: str, chunk_size: int = 50) -> list:\n    # TODO: Split into overlapping word chunks\n    pass\n\ndef build_index(docs: list) -> list:\n    # TODO: Chunk all docs, return list of dicts\n    pass\n\ndef retrieve(query: str, index: list, k: int = 3) -> list:\n    # TODO: Return top-k relevant chunks\n    pass\n\ndef augmented_prompt(query: str, chunks: list) -> str:\n    # TODO: Combine chunks into context + question\n    pass`,
            'SQL': `-- RAG index (SQL)\nCREATE TABLE chunks (\n  id SERIAL PRIMARY KEY,\n  doc_id INT,\n  chunk_text TEXT,\n  chunk_index INT,\n  embedding FLOAT8[]\n);\n\n-- TODO: INSERT chunks from documents\n-- TODO: Full-text search: to_tsvector / to_tsquery\n-- TODO: SELECT top-k chunks for a query\n-- TODO: Build augmented prompt string from results`,
          },
          solution:'chunkDocument',
          validationRules:['Chunking function','Index building','Retrieval logic','Prompt augmentation'],
          tests:['Chunks created','Index built','Query retrieves chunks','Prompt includes context','Top-K works'] },
      ],

      intermediate: [
        { title:'Fine-tuning Data Prep', time:'40',
          desc:`<h3>Task 1: Dataset Preparation for Fine-tuning</h3>`,
          starterCode:`const data=[{input:"What is ML?",output:"Machine learning is..."},{input:"Explain neural nets",output:"Neural networks..."}];\n// TODO: validateExample(ex)\n// TODO: formatForSFT(examples) - JSONL\n// TODO: splitDataset(examples, 0.8)\n// TODO: computeDataStats(split)`,
          starterCodes: {
            'JavaScript': `// Fine-tuning Data Prep (JavaScript)\nconst data = [{input:"What is ML?",output:"Machine learning is..."},{input:"Explain neural nets",output:"Neural networks are..."}];\n\nfunction validateExample(ex) {\n  // TODO: Check input and output non-empty, reasonable length\n}\n\nfunction formatForSFT(examples) {\n  // TODO: Return JSONL string with {messages:[{role,content}]}\n}\n\nfunction splitDataset(examples, trainRatio = 0.8) {\n  // TODO: Shuffle and split into train/val\n}\n\nfunction computeDataStats(split) {\n  // TODO: avg length, token estimates, label distribution\n}\n\nmodule.exports = { validateExample, formatForSFT, splitDataset, computeDataStats };`,
            'Python': `# Fine-tuning Data Prep (Python)\nimport json, random\ndata = [{'input':'What is ML?','output':'Machine learning is...'},{'input':'Explain neural nets','output':'Neural networks are...'}]\n\ndef validate_example(ex: dict) -> bool:\n    # TODO: Check input/output non-empty and < 2048 tokens\n    pass\n\ndef format_for_sft(examples: list) -> str:\n    # TODO: Return JSONL string for OpenAI fine-tuning format\n    pass\n\ndef split_dataset(examples: list, train_ratio: float = 0.8):\n    # TODO: Shuffle and split\n    pass\n\ndef compute_data_stats(split: dict) -> dict:\n    # TODO: Avg length, estimated tokens, counts\n    pass`,
            'SQL': `-- Fine-tuning data management (SQL)\nCREATE TABLE training_examples (\n  id SERIAL PRIMARY KEY,\n  input_text TEXT NOT NULL,\n  output_text TEXT NOT NULL,\n  split VARCHAR(10) DEFAULT 'train',\n  token_count INT,\n  is_valid BOOLEAN DEFAULT TRUE\n);\n\n-- TODO: INSERT examples\n-- TODO: Validate: flag empty or too-long rows\n-- TODO: Assign train/val split randomly\n-- TODO: Stats: AVG length, COUNT per split`,
          },
          solution:'formatForSFT',
          validationRules:['Validation function','JSONL formatting','Train/val split','Stats computed'],
          tests:['Validation works','JSONL format correct','80/20 split','Stats computed','Empty fields caught'] },

        { title:'ReAct Agent', time:'50',
          desc:`<h3>Task 2: ReAct Agent with Tool Use</h3>`,
          starterCode:`const tools={calculator:(expr)=>eval(expr),search:(q)=>\`Results for: \${q}\`,weather:(city)=>\`\${city}: 28°C\`};\n// TODO: parseAction(response)\n// TODO: executeTool(name, args)\n// TODO: runAgent(question, maxSteps=5)`,
          starterCodes: {
            'JavaScript': `// ReAct Agent (JavaScript)\nconst tools = {\n  calculator: (expr) => eval(expr),\n  search: (q) => \`Results for: \${q}\`,\n  weather: (city) => \`\${city}: 28°C sunny\`\n};\n\nfunction parseAction(response) {\n  // TODO: Extract Action: tool_name and Action Input: args from response\n  // Return { tool, args } or null if Final Answer\n}\n\nfunction executeTool(name, args) {\n  // TODO: Call tools[name](args), handle missing tool\n}\n\nasync function runAgent(question, maxSteps = 5) {\n  // TODO: Loop: Thought → Action → Observation → repeat\n  // TODO: Stop on Final Answer or maxSteps\n}\n\nmodule.exports = { parseAction, executeTool, runAgent };`,
            'Python': `# ReAct Agent (Python)\ntools = {\n    'calculator': lambda expr: eval(expr),\n    'search': lambda q: f'Results for: {q}',\n    'weather': lambda city: f'{city}: 28°C sunny'\n}\n\ndef parse_action(response: str) -> dict:\n    # TODO: Extract Action and Action Input from response\n    pass\n\ndef execute_tool(name: str, args: str) -> str:\n    # TODO: Call tools[name](args), handle KeyError\n    pass\n\ndef run_agent(question: str, max_steps: int = 5) -> str:\n    # TODO: Thought → Action → Observation loop\n    # TODO: Return Final Answer\n    pass`,
            'SQL': `-- Agent action logging (SQL)\nCREATE TABLE agent_trace (\n  id SERIAL PRIMARY KEY,\n  session_id UUID,\n  step_num INT,\n  thought TEXT,\n  action VARCHAR(50),\n  action_input TEXT,\n  observation TEXT,\n  is_final BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: INSERT each step\n-- TODO: SELECT full trace by session\n-- TODO: Aggregate: avg steps to answer, tool usage counts`,
          },
          solution:'runAgent',
          validationRules:['parseAction defined','executeTool defined','runAgent with loop','Tool calls made','Final answer extracted'],
          tests:['Action parsed','Tool executed','Loop runs','Calculator works','Max steps enforced'] },

        { title:'Vector Database', time:'45',
          desc:`<h3>Task 3: Vector Database Implementation</h3>`,
          starterCode:`class VectorDB {\n  constructor(){this.index=[];this.meta=[];}\n  // TODO: upsert(id, vec, meta)\n  // TODO: batchUpsert(items)\n  // TODO: search(query, k, filter)\n  // TODO: delete(id)\n  // TODO: getStats()\n}\nmodule.exports = VectorDB;`,
          starterCodes: {
            'JavaScript': `// Vector Database (JavaScript)\nclass VectorDB {\n  constructor() {\n    this.index = []; // [{id, vector, meta}]\n  }\n\n  upsert(id, vector, meta = {}) {\n    // TODO: Insert or update by id\n  }\n\n  batchUpsert(items) {\n    // TODO: items = [{id, vector, meta}]\n  }\n\n  search(queryVector, k = 5, filter = null) {\n    // TODO: Cosine similarity, apply filter, return top-k\n  }\n\n  delete(id) {\n    // TODO: Remove by id\n  }\n\n  getStats() {\n    // TODO: { count, dimensions, memoryUsage }\n  }\n}\n\nmodule.exports = VectorDB;`,
            'Python': `# Vector Database (Python)\nimport numpy as np\n\nclass VectorDB:\n    def __init__(self):\n        self.index = []  # list of {id, vector, meta}\n\n    def upsert(self, id: str, vector: list, meta: dict = {}):\n        # TODO: Insert or update\n        pass\n\n    def batch_upsert(self, items: list):\n        # TODO: List of {id, vector, meta}\n        pass\n\n    def search(self, query_vector: list, k: int = 5, filter_fn=None) -> list:\n        # TODO: Cosine similarity, filter, top-k\n        pass\n\n    def delete(self, id: str) -> bool:\n        # TODO: Remove by id\n        pass\n\n    def get_stats(self) -> dict:\n        # TODO: count, dimensions, memory estimate\n        pass`,
            'SQL': `-- Vector DB (SQL / pgvector)\nCREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE vector_store (\n  id VARCHAR(100) PRIMARY KEY,\n  embedding vector(1536),\n  metadata JSONB,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: INSERT / ON CONFLICT UPDATE (upsert)\n-- TODO: SELECT id, 1 - (embedding <=> query) AS similarity\n--       ORDER BY embedding <=> query LIMIT k\n-- TODO: DELETE by id\n-- TODO: Stats: COUNT, AVG vector dimensions`,
          },
          solution:'upsert',
          validationRules:['upsert method','batchUpsert method','search with filter','delete method','getStats method'],
          tests:['Upsert works','Batch upsert works','Search returns topK','Filter applied','Stats accurate'] },

        { title:'LLM Evaluation', time:'50',
          desc:`<h3>Task 4: LLM Evaluation Suite</h3>`,
          starterCode:`// TODO: bleuScore(ref, candidate)\n// TODO: semanticScore(ref, candidate)\n// TODO: factualityCheck(response, context)\n// TODO: runEvalSuite(testCases)\n// TODO: redTeamTest(model, prompts)`,
          starterCodes: {
            'JavaScript': `// LLM Evaluation (JavaScript)\nfunction bleuScore(reference, candidate) {\n  // TODO: n-gram precision, brevity penalty\n}\n\nfunction semanticScore(reference, candidate) {\n  // TODO: Cosine similarity of mock embeddings\n}\n\nfunction factualityCheck(response, context) {\n  // TODO: Check if key facts from context appear in response\n}\n\nfunction runEvalSuite(testCases) {\n  // TODO: [{prompt, reference, response}] → scores + report\n}\n\nfunction redTeamTest(modelFn, adversarialPrompts) {\n  // TODO: Test model on jailbreak/harmful prompts, flag failures\n}\n\nmodule.exports = { bleuScore, semanticScore, factualityCheck, runEvalSuite, redTeamTest };`,
            'Python': `# LLM Evaluation (Python)\nfrom collections import Counter\nimport numpy as np\n\ndef bleu_score(reference: str, candidate: str) -> float:\n    # TODO: n-gram overlap with brevity penalty\n    pass\n\ndef semantic_score(reference: str, candidate: str) -> float:\n    # TODO: Cosine similarity of embeddings\n    pass\n\ndef factuality_check(response: str, context: str) -> dict:\n    # TODO: Extract facts from context, verify in response\n    pass\n\ndef run_eval_suite(test_cases: list) -> dict:\n    # TODO: Run all metrics, aggregate report\n    pass\n\ndef red_team_test(model_fn, adversarial_prompts: list) -> list:\n    # TODO: Test model safety, flag policy violations\n    pass`,
            'SQL': `-- Evaluation results (SQL)\nCREATE TABLE eval_results (\n  id SERIAL PRIMARY KEY,\n  test_case_id INT,\n  model_version VARCHAR(50),\n  bleu_score FLOAT,\n  semantic_score FLOAT,\n  factuality_score FLOAT,\n  red_team_passed BOOLEAN,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: INSERT evaluation results\n-- TODO: AVG scores per model version\n-- TODO: Flag red team failures\n-- TODO: Trend: score over time`,
          },
          solution:'bleuScore',
          validationRules:['BLEU score function','Semantic score function','Factuality check','runEvalSuite defined'],
          tests:['BLEU computed','Semantic score works','Factuality checked','Suite runs all tests','Report generated'] },

        { title:'Multi-Modal Pipeline', time:'55',
          desc:`<h3>Task 5: Multi-Modal AI Pipeline</h3>`,
          starterCode:`// TODO: processText(text)\n// TODO: processImage(desc)\n// TODO: extractStructured(content)\n// TODO: fusedAnalysis(text, image, data)\n// TODO: generateReport(analysis)`,
          starterCodes: {
            'JavaScript': `// Multi-Modal Pipeline (JavaScript)\nfunction processText(text) {\n  // TODO: Extract entities, sentiment, key topics\n  return { entities: [], sentiment: '', topics: [] };\n}\n\nfunction processImage(imageDesc) {\n  // TODO: Simulate image analysis — objects, colors, scene\n  return { objects: [], scene: '', confidence: 0 };\n}\n\nfunction extractStructured(content) {\n  // TODO: Parse content into structured fields\n  return {};\n}\n\nfunction fusedAnalysis(textResult, imageResult, dataResult) {\n  // TODO: Combine modality results into unified analysis\n  return {};\n}\n\nfunction generateReport(analysis) {\n  // TODO: Format analysis as markdown report\n  return '';\n}\n\nmodule.exports = { processText, processImage, extractStructured, fusedAnalysis, generateReport };`,
            'Python': `# Multi-Modal Pipeline (Python)\ndef process_text(text: str) -> dict:\n    # TODO: Extract entities, sentiment, topics\n    return {'entities': [], 'sentiment': '', 'topics': []}\n\ndef process_image(image_desc: str) -> dict:\n    # TODO: Simulate image analysis\n    return {'objects': [], 'scene': '', 'confidence': 0.0}\n\ndef extract_structured(content: str) -> dict:\n    # TODO: Parse to structured fields\n    return {}\n\ndef fused_analysis(text_r: dict, image_r: dict, data_r: dict) -> dict:\n    # TODO: Merge all modality results\n    return {}\n\ndef generate_report(analysis: dict) -> str:\n    # TODO: Format as markdown\n    return ''`,
            'SQL': `-- Multi-modal results (SQL)\nCREATE TABLE multimodal_results (\n  id SERIAL PRIMARY KEY,\n  session_id UUID,\n  text_entities JSONB,\n  text_sentiment VARCHAR(20),\n  image_objects JSONB,\n  image_scene VARCHAR(100),\n  fused_analysis JSONB,\n  report TEXT,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: INSERT pipeline results\n-- TODO: Query most common entities\n-- TODO: Aggregate sentiment distribution\n-- TODO: Join with user sessions`,
          },
          solution:'fusedAnalysis',
          validationRules:['processText defined','processImage defined','extractStructured defined','fusedAnalysis defined'],
          tests:['Text processed','Image analyzed','Data extracted','Fusion works','Report generated'] },
      ],

      hard: [
        { title:'Transformer Block', time:'70',
          desc:`<h3>Task 1: Transformer Architecture</h3>`,
          starterCode:`// TODO: scaledDotAttention(Q,K,V,mask)\n// TODO: multiHeadAttention(x, heads, dModel)\n// TODO: posEncoding(seqLen, dModel)\n// TODO: feedForward(x, dModel, dFF)\n// TODO: transformerBlock(x, heads, dModel, dFF)`,
          starterCodes: {
            'JavaScript': `// Transformer (JavaScript)\nfunction scaledDotAttention(Q, K, V, mask = null) {\n  // TODO: scores = Q @ K.T / sqrt(dK)\n  // TODO: Apply mask if provided\n  // TODO: softmax(scores) @ V\n}\n\nfunction multiHeadAttention(x, numHeads, dModel) {\n  // TODO: Split into heads, apply attention, concat\n}\n\nfunction posEncoding(seqLen, dModel) {\n  // TODO: PE[pos][2i] = sin(pos/10000^(2i/dModel))\n  // TODO: PE[pos][2i+1] = cos(...)\n}\n\nfunction feedForward(x, dModel, dFF) {\n  // TODO: Linear → ReLU → Linear\n}\n\nfunction transformerBlock(x, numHeads, dModel, dFF) {\n  // TODO: MHA + residual + LayerNorm + FFN + residual + LayerNorm\n}\n\nmodule.exports = { scaledDotAttention, multiHeadAttention, posEncoding, feedForward, transformerBlock };`,
            'Python': `# Transformer (Python)\nimport numpy as np\n\ndef scaled_dot_attention(Q, K, V, mask=None):\n    # TODO: scores = Q @ K.T / np.sqrt(K.shape[-1])\n    # TODO: Apply mask\n    # TODO: softmax → weighted sum of V\n    pass\n\ndef multi_head_attention(x, num_heads, d_model):\n    # TODO: Split, attend, concat, project\n    pass\n\ndef pos_encoding(seq_len, d_model):\n    # TODO: sin/cos positional encoding matrix\n    pass\n\ndef feed_forward(x, d_model, d_ff):\n    # TODO: Two linear layers with ReLU\n    pass\n\ndef transformer_block(x, num_heads, d_model, d_ff):\n    # TODO: Full block with residuals and layer norm\n    pass`,
            'SQL': `-- Transformer ops in SQL (conceptual)\n-- Attention weight computation\nWITH qk AS (\n  SELECT\n    q.token_id AS query_id,\n    k.token_id AS key_id,\n    -- TODO: DOT_PRODUCT(q.vector, k.vector) / SQRT(d_k)\n    0 AS raw_score\n  FROM query_tokens q\n  CROSS JOIN key_tokens k\n),\nsoftmax AS (\n  SELECT query_id, key_id,\n    EXP(raw_score) / SUM(EXP(raw_score)) OVER (PARTITION BY query_id) AS weight\n  FROM qk\n)\n-- TODO: Weighted sum of value vectors\nSELECT * FROM softmax;`,
          },
          solution:'scaledDotAttention',
          validationRules:['scaledDotAttention defined','multiHeadAttention defined','posEncoding defined','feedForward defined','transformerBlock defined'],
          tests:['Attention computed','Multi-head works','Pos encoding created','FFN works','Full block assembled'] },

        { title:'RLHF Simulation', time:'65',
          desc:`<h3>Task 2: RLHF Pipeline Simulation</h3>`,
          starterCode:`const prefs=[{prompt:'Explain AI',chosen:'Clear answer',rejected:'Vague answer'}];\n// TODO: rewardModel(response, prompt)\n// TODO: ppoClipLoss(ratio, advantage, eps=0.2)\n// TODO: klDivPenalty(pOld, pNew, beta=0.1)\n// TODO: rlhfUpdate(batch, rewardModel)`,
          starterCodes: {
            'JavaScript': `// RLHF (JavaScript)\nconst prefs = [{prompt:'Explain AI',chosen:'Clear, detailed answer',rejected:'Vague answer'}];\n\nfunction rewardModel(response, prompt) {\n  // TODO: Score response 0-1 based on quality heuristics\n}\n\nfunction ppoClipLoss(ratio, advantage, eps = 0.2) {\n  // TODO: min(ratio * adv, clip(ratio, 1-eps, 1+eps) * adv)\n}\n\nfunction klDivPenalty(pOld, pNew, beta = 0.1) {\n  // TODO: beta * sum(pNew * log(pNew / pOld))\n}\n\nfunction rlhfUpdate(batch, rewardModelFn) {\n  // TODO: Get rewards, compute advantages, PPO update\n}\n\nmodule.exports = { rewardModel, ppoClipLoss, klDivPenalty, rlhfUpdate };`,
            'Python': `# RLHF (Python)\nimport numpy as np\nprefs = [{'prompt':'Explain AI','chosen':'Clear answer','rejected':'Vague answer'}]\n\ndef reward_model(response: str, prompt: str) -> float:\n    # TODO: Heuristic quality score 0-1\n    pass\n\ndef ppo_clip_loss(ratio: float, advantage: float, eps: float = 0.2) -> float:\n    # TODO: min(r*A, clip(r, 1-eps, 1+eps)*A)\n    pass\n\ndef kl_div_penalty(p_old: np.ndarray, p_new: np.ndarray, beta: float = 0.1) -> float:\n    # TODO: beta * KL(p_new || p_old)\n    pass\n\ndef rlhf_update(batch: list, reward_fn) -> dict:\n    # TODO: Full PPO update step\n    pass`,
            'SQL': `-- RLHF logging (SQL)\nCREATE TABLE rlhf_preferences (\n  id SERIAL PRIMARY KEY,\n  prompt TEXT,\n  chosen_response TEXT,\n  rejected_response TEXT,\n  reward_chosen FLOAT,\n  reward_rejected FLOAT,\n  margin FLOAT GENERATED ALWAYS AS (reward_chosen - reward_rejected) STORED\n);\n\n-- TODO: INSERT preference pairs with rewards\n-- TODO: AVG margin (should be > 0)\n-- TODO: Flag pairs where margin < 0 (bad labels)\n-- TODO: Training loss proxy: -LOG(sigmoid(margin))`,
          },
          solution:'ppoClipLoss',
          validationRules:['rewardModel defined','ppoClipLoss defined','klDivPenalty defined','rlhfUpdate defined'],
          tests:['Reward model scores','PPO clip correct','KL penalty computed','Update step runs','Convergence logic'] },

        { title:'Inference Optimization', time:'65',
          desc:`<h3>Task 3: LLM Inference Optimization</h3>`,
          starterCode:`class InferenceEngine {\n  constructor(cfg){this.kvCache=new Map();this.stats={tokens:0,hits:0,misses:0};}\n  // TODO: generate(prompt, maxTokens)\n  // TODO: batchGenerate(prompts)\n  // TODO: speculativeStep(draft, verifier)\n  // TODO: benchmark(prompts)\n}\nmodule.exports = InferenceEngine;`,
          starterCodes: {
            'JavaScript': `// Inference Engine (JavaScript)\nclass InferenceEngine {\n  constructor(config = {}) {\n    this.kvCache = new Map(); // prefix → cached tokens\n    this.stats = { tokens: 0, cacheHits: 0, cacheMisses: 0, totalMs: 0 };\n  }\n\n  generate(prompt, maxTokens = 100) {\n    // TODO: Check KV cache, simulate token generation\n    // TODO: Update stats\n  }\n\n  batchGenerate(prompts) {\n    // TODO: Process multiple prompts with dynamic batching\n  }\n\n  speculativeStep(draftTokens, verifierFn) {\n    // TODO: Accept draft tokens until mismatch\n  }\n\n  benchmark(prompts) {\n    // TODO: Measure latency, throughput, cache hit rate\n  }\n}\n\nmodule.exports = InferenceEngine;`,
            'Python': `# Inference Engine (Python)\nimport time\n\nclass InferenceEngine:\n    def __init__(self, config=None):\n        self.kv_cache = {}  # prefix → cached output\n        self.stats = {'tokens': 0, 'cache_hits': 0, 'cache_misses': 0, 'total_ms': 0}\n\n    def generate(self, prompt: str, max_tokens: int = 100) -> str:\n        # TODO: Check cache, simulate generation, update stats\n        pass\n\n    def batch_generate(self, prompts: list) -> list:\n        # TODO: Dynamic batching\n        pass\n\n    def speculative_step(self, draft_tokens: list, verifier_fn) -> list:\n        # TODO: Accept tokens until mismatch\n        pass\n\n    def benchmark(self, prompts: list) -> dict:\n        # TODO: Latency, throughput, cache hit rate\n        pass`,
            'SQL': `-- Inference monitoring (SQL)\nCREATE TABLE inference_logs (\n  id SERIAL PRIMARY KEY,\n  prompt_hash VARCHAR(64),\n  prompt_len INT,\n  output_tokens INT,\n  latency_ms INT,\n  cache_hit BOOLEAN,\n  batch_size INT,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: Cache hit rate: AVG(cache_hit::int)\n-- TODO: P50/P95 latency\n-- TODO: Tokens per second throughput\n-- TODO: Batching efficiency: output_tokens / batch_size`,
          },
          solution:'kvCache',
          validationRules:['kvCache used','batchGenerate defined','speculativeStep defined','benchmark defined'],
          tests:['KV cache hits','Batch processing works','Speculative step runs','Benchmark runs','Stats tracked'] },

        { title:'AI Safety Red-Teaming', time:'60',
          desc:`<h3>Task 4: Automated Red-Teaming</h3>`,
          starterCode:`// TODO: jailbreakClassifier(prompt)\n// TODO: promptInjectionDefense(system, input)\n// TODO: toxicityScore(output)\n// TODO: safetyPipeline(input)\n// TODO: generateAdversarialPrompts(n)`,
          starterCodes: {
            'JavaScript': `// AI Safety (JavaScript)\nconst HARMFUL_PATTERNS = ['ignore previous', 'bypass', 'jailbreak', 'pretend you are'];\nconst TOXIC_WORDS = ['hate', 'harm', 'illegal', 'violence'];\n\nfunction jailbreakClassifier(prompt) {\n  // TODO: Check for jailbreak patterns, return {isJailbreak, confidence, pattern}\n}\n\nfunction promptInjectionDefense(systemPrompt, userInput) {\n  // TODO: Detect injection attempts, sanitize input\n}\n\nfunction toxicityScore(output) {\n  // TODO: Score 0-1 based on toxic keyword density\n}\n\nfunction safetyPipeline(input) {\n  // TODO: Run all checks, return {safe, checks, blockedReason}\n}\n\nfunction generateAdversarialPrompts(n = 10) {\n  // TODO: Generate varied jailbreak/injection attempts\n}\n\nmodule.exports = { jailbreakClassifier, promptInjectionDefense, toxicityScore, safetyPipeline, generateAdversarialPrompts };`,
            'Python': `# AI Safety (Python)\nimport re\n\nHARMFUL_PATTERNS = ['ignore previous', 'bypass', 'jailbreak', 'pretend you are']\nTOXIC_WORDS = ['hate', 'harm', 'illegal', 'violence']\n\ndef jailbreak_classifier(prompt: str) -> dict:\n    # TODO: Pattern matching + heuristics, return confidence\n    pass\n\ndef prompt_injection_defense(system_prompt: str, user_input: str) -> str:\n    # TODO: Detect and sanitize injection\n    pass\n\ndef toxicity_score(output: str) -> float:\n    # TODO: Keyword density score 0-1\n    pass\n\ndef safety_pipeline(input_text: str) -> dict:\n    # TODO: Run all checks, aggregate result\n    pass\n\ndef generate_adversarial_prompts(n: int = 10) -> list:\n    # TODO: Generate varied attack prompts\n    pass`,
            'SQL': `-- Safety audit (SQL)\nCREATE TABLE safety_checks (\n  id SERIAL PRIMARY KEY,\n  input_text TEXT,\n  jailbreak_score FLOAT,\n  injection_detected BOOLEAN,\n  toxicity_score FLOAT,\n  overall_safe BOOLEAN,\n  blocked_reason VARCHAR(100),\n  checked_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: Flag high-risk inputs (jailbreak > 0.7 OR toxicity > 0.5)\n-- TODO: COUNT blocked by reason\n-- TODO: False positive rate over time\n-- TODO: Most common attack patterns`,
          },
          solution:'jailbreakClassifier',
          validationRules:['Jailbreak classifier','Injection defense','Toxicity scoring','Safety pipeline','Adversarial generation'],
          tests:['Jailbreak detected','Injection sanitized','Toxicity scored','Pipeline blocks unsafe','Adversarial prompts generated'] },

        { title:'Production LLM System', time:'80',
          desc:`<h3>Task 5: Production LLM Platform</h3>`,
          starterCode:`const express=require('express');\nconst app=express();\napp.use(express.json());\n// TODO: Load balancer across replicas\n// TODO: A/B test: 20% to new model\n// TODO: Cost tracker\n// TODO: Fallback chain\n// TODO: SLA monitor\n// TODO: POST /v1/complete\nmodule.exports = app;`,
          starterCodes: {
            'JavaScript': `// Production LLM System (JavaScript)\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\nconst replicas = ['model-1', 'model-2', 'model-3'];\nlet rrIndex = 0;\nconst costs = { total: 0, byModel: {} };\n\nfunction loadBalance() {\n  // TODO: Round-robin across replicas\n}\n\nfunction abRoute(requestId) {\n  // TODO: 20% traffic to 'model-new', 80% to 'model-stable'\n}\n\nfunction trackCost(model, tokens) {\n  // TODO: costs per model at $0.002/1k tokens\n}\n\nfunction fallbackChain(prompt) {\n  // TODO: Try model-1 → model-2 → model-3 on failure\n}\n\nfunction checkSLA(latencyMs) {\n  // TODO: Flag if > 2000ms p95\n}\n\napp.post('/v1/complete', async (req, res) => {\n  // TODO: Use above functions to handle request\n});\n\nmodule.exports = app;`,
            'Python': `# Production LLM System (Python/FastAPI)\nfrom fastapi import FastAPI\nimport random, time\napp = FastAPI()\n\nreplicas = ['model-1', 'model-2', 'model-3']\ncosts = {'total': 0.0, 'by_model': {}}\nlatencies = []\n\ndef load_balance() -> str:\n    # TODO: Round-robin or least-connections\n    pass\n\ndef ab_route(request_id: str) -> str:\n    # TODO: 20% → model-new, 80% → model-stable\n    pass\n\ndef track_cost(model: str, tokens: int):\n    # TODO: $0.002 per 1k tokens\n    pass\n\ndef fallback_chain(prompt: str) -> str:\n    # TODO: Try each replica, return first success\n    pass\n\n@app.post('/v1/complete')\nasync def complete(request: dict):\n    # TODO: Orchestrate all components\n    pass`,
            'SQL': `-- Production LLM monitoring (SQL)\nCREATE TABLE llm_requests (\n  id SERIAL PRIMARY KEY,\n  request_id UUID DEFAULT gen_random_uuid(),\n  model_version VARCHAR(50),\n  ab_group VARCHAR(10),\n  input_tokens INT,\n  output_tokens INT,\n  cost_usd FLOAT,\n  latency_ms INT,\n  success BOOLEAN,\n  fallback_used BOOLEAN,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- TODO: P95 latency by model\n-- TODO: Cost by model per day\n-- TODO: A/B success rate comparison\n-- TODO: Fallback trigger rate\n-- TODO: SLA breach count (latency > 2000ms)`,
          },
          solution:'loadBalance',
          validationRules:['Load balancer','A/B routing','Cost tracking','Fallback chain','SLA monitoring'],
          tests:['Load balanced','A/B routes','Costs tracked','Fallback triggers','SLA computed'] },
      ],
    },
  };
  return DB[roleId] || { beginner:[], intermediate:[], hard:[] };
}
export function getStarterCodeForLanguage(task, language) {
  if (!task) return '';

  // If language is JavaScript or TypeScript, return default
  if (language === 'JavaScript' || language === 'TypeScript') {
    return task.starterCode;
  }

  // Generate language-specific starter based on task title
  const title = task.title || '';
  const desc  = task.desc?.replace(/<[^>]*>/g, '') || '';

  if (language === 'Python') {
    return `# ${title} (Python)\n# ${desc.slice(0, 100)}\n\n# TODO: Write your Python solution here\n\nif __name__ == '__main__':\n    pass`;
  }

  if (language === 'Java') {
    return `// ${title} (Java)\npublic class Solution {\n    // TODO: Write your Java solution here\n    \n    public static void main(String[] args) {\n        // Test your solution\n    }\n}`;
  }

  if (language === 'SQL') {
    return `-- ${title} (SQL)\n-- TODO: Write your SQL query here\n\nSELECT *\nFROM table_name\nWHERE condition;`;
  }

  if (language === 'R') {
    return `# ${title} (R)\n# TODO: Write your R solution here\n\n# Load required libraries\n# library(tidyverse)\n\n# Your code here\n`;
  }

  if (language === 'Excel / VBA') {
    return `' ${title} (Excel VBA)\n' TODO: Write your VBA solution here\n\nSub Solution()\n    ' Your code here\n    \nEnd Sub`;
  }

  return task.starterCode;
}