// js/db.js
// The Core Database for Questions, Categories, and Achievements

const DB = {
  Programming: [
    {q:"What does HTML stand for?", opts:["Hyper Text Markup Language","Home Tool Markup Language","Hyperlinks Text Mark Language","Hyper Tool Multi Language"], a:0},
    {q:"Which tag is used to link an external CSS file?", opts:["<style>","<css>","<link>","<script>"], a:2},
    {q:"'typeof null' in JavaScript returns?", opts:["null","undefined","object","boolean"], a:2},
    {q:"Which is NOT a JavaScript data type?", opts:["String","Float","Boolean","Symbol"], a:1},
    {q:"What does CSS stand for?", opts:["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"], a:1},
    {q:"Which method adds an element to the end of an array?", opts:[".pop()",".shift()",".push()",".unshift()"], a:2},
    {q:"Which symbol is used for single-line comments in JS?", opts:["/* */","//","#","--"], a:1},
    {q:"What does DOM stand for?", opts:["Document Object Model","Data Object Model","Document Oriented Model","Digital Object Map"], a:0},
    {q:"How do you create a function in JavaScript?", opts:["function myFunc()","def myFunc()","func myFunc()","function:myFunc()"], a:0},
    {q:"Which event occurs when the user clicks on an HTML element?", opts:["onchange","onclick","onmouseclick","onmouseover"], a:1}
  ],
  DSA: [
    {q:"Time complexity of Binary Search?", opts:["O(n)","O(log n)","O(n²)","O(1)"], a:1},
    {q:"Which data structure uses FIFO?", opts:["Stack","Queue","Tree","Graph"], a:1},
    {q:"Which data structure uses LIFO?", opts:["Queue","Array","Stack","LinkedList"], a:2},
    {q:"Worst case time complexity of QuickSort?", opts:["O(n)","O(n log n)","O(n²)","O(log n)"], a:2},
    {q:"A binary tree with n nodes has how many edges?", opts:["n","n-1","n+1","2n"], a:1},
    {q:"Which traversal visits Root → Left → Right?", opts:["Inorder","Preorder","Postorder","Level-order"], a:1},
    {q:"What is the space complexity of Depth First Search?", opts:["O(1)","O(V)","O(E)","O(V+E)"], a:1},
    {q:"Which sorting algorithm is not stable?", opts:["Merge Sort","Bubble Sort","Insertion Sort","Quick Sort"], a:3},
    {q:"What data structure is used for BFS?", opts:["Stack","Queue","Heap","Tree"], a:1},
    {q:"Maximum number of nodes at level 'l' in a binary tree?", opts:["2^l","2^(l-1)","2l","l^2"], a:1}
  ],
  Aptitude: [
    {q:"What is 15% of 200?", opts:["20","25","30","35"], a:2},
    {q:"If x + 5 = 12, what is x?", opts:["5","6","7","8"], a:2},
    {q:"A train travels 60 km in 1 hr. Speed in m/s?", opts:["16.67","20.5","15.0","18.2"], a:0},
    {q:"What comes next: 2, 6, 12, 20, ?", opts:["28","30","32","24"], a:1},
    {q:"Ratio of 4:5 means?", opts:["4/5","5/4","4+5","4×5"], a:0},
    {q:"LCM of 12 and 15?", opts:["30","60","90","120"], a:1},
    {q:"Square root of 144?", opts:["10","12","14","16"], a:1},
    {q:"If 5x = 25, then x^2 is?", opts:["5","10","25","125"], a:2},
    {q:"A man buys a toy for $50 and sells for $60. Profit %?", opts:["10%","20%","25%","30%"], a:1},
    {q:"Average of first 5 natural numbers?", opts:["2","3","4","5"], a:1}
  ],
  GeneralKnowledge: [
    {q:"Capital of France?", opts:["London","Berlin","Paris","Madrid"], a:2},
    {q:"Largest ocean on Earth?", opts:["Atlantic","Indian","Arctic","Pacific"], a:3},
    {q:"Who wrote 'Hamlet'?", opts:["Dickens","Shakespeare","Twain","Austen"], a:1},
    {q:"How many continents are there?", opts:["5","6","7","8"], a:2},
    {q:"Which is the smallest planet?", opts:["Mars","Venus","Mercury","Pluto"], a:2},
    {q:"Longest river in the world?", opts:["Amazon","Nile","Yangtze","Mississippi"], a:1},
    {q:"Current US President (as of 2024)?", opts:["Obama","Trump","Biden","Bush"], a:2},
    {q:"Currency of Japan?", opts:["Yen","Won","Yuan","Dollar"], a:0},
    {q:"Largest mammal?", opts:["Elephant","Blue Whale","Giraffe","Shark"], a:1},
    {q:"Which country is known as the Land of Rising Sun?", opts:["China","Japan","Thailand","Korea"], a:1}
  ],
  AIML: [
    {q:"What does AI stand for?", opts:["Artificial Intelligence","Auto Intel","Art Intel","Anti Intelligence"], a:0},
    {q:"What is Machine Learning?", opts:["Programming rules","Learning from data","Building hardware","Networking"], a:1},
    {q:"What is a Neural Network modeled after?", opts:["Computer chips","Human brain","DNA","Web structures"], a:1},
    {q:"Which algorithm is used for Classification?", opts:["Linear Regression","K-Means","Logistic Regression","PCA"], a:2},
    {q:"What does NLP stand for?", opts:["Natural Logic Process","New Language Program","Natural Language Processing","None"], a:2},
    {q:"Which is an Unsupervised Learning method?", opts:["Decision Trees","SVM","Clustering","Random Forest"], a:2},
    {q:"What is overfitting?", opts:["High training error","Low testing error","High variance","High bias"], a:2},
    {q:"What is backpropagation used for?", opts:["Forward pass","Updating weights","Initializing data","Evaluating"], a:1},
    {q:"Common library for Deep Learning in Python?", opts:["React","TensorFlow","Express","Django"], a:1},
    {q:"What is GPT?", opts:["General Purpose Tech","Generative Pre-trained Transformer","Global Position Tracker","None"], a:1}
  ],
  WebDev: [
    {q:"What does HTTP stand for?", opts:["Hyper Text Transfer Protocol","Hyper Tool Transfer","Home Text Protocol","None"], a:0},
    {q:"Which is a CSS framework?", opts:["React","Angular","Tailwind","Vue"], a:2},
    {q:"What is the purpose of React?", opts:["Database","UI building","Styling","Server routing"], a:1},
    {q:"Which status code indicates 'Not Found'?", opts:["200","403","404","500"], a:2},
    {q:"What does API stand for?", opts:["Application Programming Interface","Applied Program Interconnect","Auto Processing Intel","None"], a:0},
    {q:"What is Node.js used for?", opts:["Browser UI","Backend execution","Styling","Database storage"], a:1},
    {q:"Which attribute specifies an image source?", opts:["href","link","src","url"], a:2},
    {q:"How to select an element with id 'app' in CSS?", opts:[".app","#app","*app","app"], a:1},
    {q:"What is LocalStorage?", opts:["Server DB","Cloud storage","Browser storage","Flash drive"], a:2},
    {q:"Which specifies a responsive viewport?", opts:["<meta name='viewport'>","<responsive>","<css-view>","None"], a:0}
  ]
};

const FLASHCARDS = [
  {q:"What is a Closure in JavaScript?", a:"A function that retains access to its outer scope's variables even after the outer function has returned."},
  {q:"What is Big-O Notation?", a:"A mathematical notation describing the upper bound of an algorithm's time or space complexity."},
  {q:"What is the DOM?", a:"Document Object Model — a tree-like API allowing scripts to dynamically access and update page content."},
  {q:"Difference between == and === in JS?", a:"== checks value equality with type coercion. === checks both value AND type strictly."},
  {q:"What is a Stack?", a:"A linear data structure that follows Last-In-First-Out (LIFO) principle."},
  {q:"What is recursion?", a:"A technique where a function calls itself to solve smaller sub-problems of the same type."}
];

const CATEGORIES = [
  {id:'Programming', name:'Programming', icon:'ph-code', color:'blue'},
  {id:'DSA', name:'DSA', icon:'ph-tree-structure', color:'green'},
  {id:'Aptitude', name:'Aptitude', icon:'ph-math-operations', color:'orange'},
  {id:'GeneralKnowledge', name:'General Knowledge', icon:'ph-globe', color:'cyan'},
  {id:'AIML', name:'AI / ML', icon:'ph-robot', color:'purple'},
  {id:'WebDev', name:'Web Development', icon:'ph-browsers', color:'pink'}
];

const BADGES = [
  {id:'first_login', name:'First Steps', icon:'⚡', req:'Login for the first time'},
  {id:'quiz_5', name:'Quiz Warrior', icon:'⚔️', req:'Play 5 quizzes'},
  {id:'quiz_10', name:'Quiz Master', icon:'🏅', req:'Play 10 quizzes'},
  {id:'perfect', name:'Perfectionist', icon:'💎', req:'Get 100% on a quiz'},
  {id:'streak_3', name:'On Fire', icon:'🔥', req:'3 day streak'},
  {id:'battle_win', name:'Champion', icon:'🏆', req:'Win a battle'}
];

const RIVALS = ["CyberNinja","AlgoQueen","CodeWolf","ByteStorm","DataDragon","PixelPunk"];
