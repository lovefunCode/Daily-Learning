const fs = require('fs');

console.log('START');

setTimeout(() => console.log('TIMER 0ms'), 0);

// Timer for 50ms
setTimeout(() => console.log('TIMER 2ms'), 2);

// Timer for 150ms  
setTimeout(() => console.log('TIMER 5ms'), 5);

// File read (takes ~10ms)
fs.readFile(__filename, () => {
  console.log('FILE READ complete');
  
  setImmediate(() => console.log('IMMEDIATE inside file read'));
  
  setTimeout(() => console.log('TIMER 0ms inside file read'), 0);
});

setImmediate(() => console.log('IMMEDIATE 1'));

console.log('END');


// START
// END
// IMMEDIATE 1
// TIMER 0ms
// FILE READ complete
// IMMEDIATE inside file read
// TIMER 2ms
// TIMER 0ms inside file read
// TIMER 5ms

// ## 3. Node.js Timers

// ### Event Loop Architecture
// ```
//    ┌───────────────────────────┐
// ┌─>│           timers          │ ← setTimeout, setInterval
// │  └─────────────┬─────────────┘
// │  ┌─────────────▼─────────────┐
// │  │     pending callbacks     │ ← I/O callbacks (deferred)
// │  └─────────────┬─────────────┘
// │  ┌─────────────▼─────────────┐
// │  │       idle, prepare       │ ← Internal use
// │  └─────────────┬─────────────┘
// │  ┌─────────────▼─────────────┐
// │  │           poll            │ ← I/O operations
// │  └─────────────┬─────────────┘
// │  ┌─────────────▼─────────────┐
// │  │           check           │ ← setImmediate callbacks
// │  └─────────────┬─────────────┘
// │  ┌─────────────▼─────────────┐
// │  │      close callbacks      │ ← socket.on('close', ...)
// │  └───────────────────────────┘
// │
// │  ┌───────────────────────────┐
// │  │   process.nextTick        │ ← Highest priority!
// │  │   (after each phase)      │
// │  └───────────────────────────┘
// │
// │  ┌───────────────────────────┐
// │  │   Promise Microtasks      │ ← After nextTick
// │  └───────────────────────────┘
// │
// └──────────────────────────────────┘


