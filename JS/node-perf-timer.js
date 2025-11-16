const {performance}  = require('perf_hooks')
const start = performance.now()

function log(msg){
    const elapsed = (performance.now() - start).toFixed(3)
    console.log(`[${elapsed} ms]  ${msg}`)
}

log('1: Sync: start')

setTimeout(()=>{
    log('2: SetTimeout 0')
})

setTimeout(()=>{
    log('3: SetTimeout 10')
}, 10)

setImmediate(()=>{
    log('4: SetImmediate 1')

    setImmediate(()=>{
        log('5: Nested SetImmediate')
    })
})

Promise.resolve().then(()=>{
    log('6: Promise 1')
})

Promise.resolve().then(()=>{
    log('8: Promise 2')

    setImmediate(()=>{
        log('9: setImmediate in Promise')
    })
})

setImmediate(()=>{
    log('10: setImmediate 2')
})

 log('11: Sync End')

// [0.008 ms]  1: Sync: start
// [9.865 ms]  11: Sync End
// [10.103 ms]  6: Promise 1
// [10.195 ms]  8: Promise 2
// [10.535 ms]  2: SetTimeout 0
// [10.733 ms]  4: SetImmediate 1
// [10.856 ms]  10: setImmediate 2
// [11.301 ms]  9: setImmediate in Promise
// [11.606 ms]  5: Nested SetImmediate
// [18.947 ms]  3: SetTimeout 10


// [0.009 ms]  1: Sync: start
// [3.221 ms]  11: Sync End
// [3.498 ms]  6: Promise 1
// [3.554 ms]  8: Promise 2
// [3.741 ms]  4: SetImmediate 1
// [3.838 ms]  10: setImmediate 2
// [3.882 ms]  9: setImmediate in Promise
// [4.186 ms]  5: Nested SetImmediate
// [4.404 ms]  2: SetTimeout 0
// [14.734 ms]  3: SetTimeout 10

// Reason: why different output
// The non-deterministic part: setTimeout(0) vs setImmediate()

// Run from main module
// run this multiple times - you might see different orders
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))

// Output varies:
// Sometimes: timeout → immediate
// Sometimes: immediate → timeout

// Why the order varies:
// setTimeout(0) goes to the Timer phase
//  setImmediate() goes to the check phase
// when you run this code from the main module, the event loop might
// 1. start checking timers before the 1ms minimum delay has elapsed setImmediate runs first
// 2. start checking timers after the delay has elapsed -> setTimeout runs first
//  It depends on : 
//      process performance at startup
//      system load
//      How quickly Node.js enters the event loop


// but if you run them inside an I/O callback, setImmediate is always first
const fs = require('fs')
fs.readFile(__filename, ()=>{
    setTimeout(()=> console.log('timeout'), 0)
    setImmediate(()=> console.log('immediate'))
    // always : immediate -> timeout
})









