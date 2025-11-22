console.log('===start===')


Promise.resolve().then(()=>{
    console.log('1 Promise======')
    queueMicrotask(()=>{
        console.log('promise queueMicrotask======')
        Promise.resolve().then(()=>{
            console.log('3 nested Promise======')
        })
    })

})

queueMicrotask(()=>{
    console.log('web queueMicrotask======')
    Promise.resolve().then(()=>{
        console.log('2 queueMicrotask Promise======')
    })
})

setTimeout(()=>{
    console.log('setTimeout ===== ')
    Promise.resolve().then(()=>{
        console.log('setTimeout Promise======')
    })
})

requestAnimationFrame(()=>{
    console.log('requestAnimationFrame=====')
})

requestIdleCallback(()=>{
    console.log('requestIdleCallback=====')
})

console.log('===end====')

// output =====
// ===start===
// VM88:36 ===end====
// VM88:4 1 Promise======
// VM88:15 web queueMicrotask======
// VM88:6 promise queueMicrotask======
// VM88:17 2 queueMicrotask Promise======
// VM88:8 3 nested Promise======
// undefined
// VM88:29 requestAnimationFrame=====
// VM88:22 setTimeout ===== 
// VM88:24 setTimeout Promise======
// VM88:33 requestIdleCallback=====


// Key insights:  Promise.then() and queueMicrotasks() are equivalent:
// They both add tasks to the same microtask queuw with the same priority
//  So there is no priority between Promise.then() and queueMicrotasks(), 
// it depends on their code position in the file

// Eg2:
console.log('===start===')

queueMicrotask(()=>{
    console.log('web queueMicrotask======')
    Promise.resolve().then(()=>{
        console.log('2 queueMicrotask Promise======')
    })
})

Promise.resolve().then(()=>{
    console.log('1 Promise======')
    queueMicrotask(()=>{
        console.log('promise queueMicrotask======')
        Promise.resolve().then(()=>{
            console.log('3 nested Promise======')
        })
    })

})

setTimeout(()=>{
    console.log('setTimeout ===== ')
    Promise.resolve().then(()=>{
        console.log('setTimeout Promise======')
    })
})

requestAnimationFrame(()=>{
    console.log('requestAnimationFrame=====')
})

requestIdleCallback(()=>{
    console.log('requestIdleCallback=====')
})

console.log('===end====')


// ===start===
// VM59:38 ===end====
// VM59:4 web queueMicrotask======
// VM59:11 1 Promise======
// VM59:6 2 queueMicrotask Promise======
// VM59:13 promise queueMicrotask======
// VM59:15 3 nested Promise======
// undefined
// VM59:31 requestAnimationFrame=====
// VM59:24 setTimeout ===== 
// VM59:26 setTimeout Promise======
// VM59:35 requestIdleCallback=====


// ┌───────────────────────────┐
// │     Call Stack            │
// │   (Synchronous Code)      │
// └─────────────┬─────────────┘
//               │
// ┌─────────────▼─────────────┐
// │   Microtask Queue         │
// │   - Promise.then()        │
// │   - queueMicrotask()      │
// │   - MutationObserver      │
// └─────────────┬─────────────┘
//               │
// ┌─────────────▼─────────────┐
// │   Render Pipeline         │
// │   - Style calculation     │
// │   - Layout                │
// │   - Paint                 │
// └─────────────┬─────────────┘
//               │
// ┌─────────────▼─────────────┐
// │   Macrotask Queue         │
// │   - setTimeout            │
// │   - setInterval           │
// │   - I/O                   │
// └─────────────┬─────────────┘
//               │
// ┌─────────────▼─────────────┐
// │   requestAnimationFrame   │
// │   (before next paint)     │
// └─────────────┬─────────────┘
//               │
// ┌─────────────▼─────────────┐
// │   requestIdleCallback     │
// │   (when browser is idle)  │
// └───────────────────────────┘