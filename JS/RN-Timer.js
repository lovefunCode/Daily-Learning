import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function ExecutionOrderDemo() {
  const [logs, setLogs] = useState([]);
  
  const addLog = (message) => {
    setLogs(prev => [...prev, `${Date.now()}: ${message}`]);
  };
  
  const runTest = () => {
    setLogs([]);
    const startTime = Date.now();
    
    console.log('START');
    addLog('START');
    
    // 1. Synchronous
    console.log('1. Sync');
    addLog('1. Sync');
    
   
    
    // 3. Promise (microtask)
    Promise.resolve().then(() => {
      const elapsed = Date.now() - startTime;
      console.log(`3. Promise (${elapsed}ms)`);
      addLog(`3. Promise (${elapsed}ms)`);
      Promise.resolve().then(() => {
        const elapsed = Date.now() - startTime;
        console.log(`4. nested Promise (${elapsed}ms)`);
        addLog(`4. nested Promise (${elapsed}ms)`);
      });
    });

     // 2. setImmediate
     setImmediate(() => {
      const elapsed = Date.now() - startTime;
      console.log(`2. setImmediate (${elapsed}ms)`);
      setImmediate(()=>{
        const elapsed = Date.now() - startTime;
        console.log(`3.  nested setImmediate (${elapsed}ms)`);
        addLog(`3. nested setImmediate (${elapsed}ms)`);
      })
      addLog(`2. setImmediate (${elapsed}ms)`);
    });

    // Bridge crossing -- batch sent to native

    // 4. requestAnimationFrame   after frame ready
    // When the frame is ready, the callback will be executed
    requestAnimationFrame(() => {
      const elapsed = Date.now() - startTime;
      console.log(`4. requestAnimationFrame (${elapsed}ms)`);
      addLog(`4. requestAnimationFrame (${elapsed}ms)`);
    });
    
    // 5. setTimeout
    setTimeout(() => {
      const elapsed = Date.now() - startTime;
      console.log(`5. setTimeout (${elapsed}ms)`);
      addLog(`5. setTimeout (${elapsed}ms)`);
    }, 0);
    
    // 6. Synchronous end
    console.log('6. Sync end');
    addLog('6. Sync end');
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Button title="Run Test" onPress={runTest} />
      {logs.map((log, index) => (
        <Text key={index}>{log}</Text>
      ))}
    </View>
  );
}

// Typical output:
// 0ms: START
// 0ms: 1. Sync
// 0ms: 6. Sync end
// 1ms: 3. Promise (1ms)
// 1ms: 2. setImmediate (1ms)
// 16ms: 4. requestAnimationFrame (16ms) ← Waits for frame!
// 20ms: 5. setTimeout (20ms)

// Batched Message Queue System

// ## 2. React Native Timers

// ### Event Loop Architecture
// ```
// JavaScript Thread              Bridge              Native Thread
// ─────────────────             ────────            ─────────────

// ┌───────────────────────┐
// │  Synchronous Code     │
// └──────────┬────────────┘
//            │
// ┌──────────▼────────────┐
// │  Microtask Queue      │
// │  (Promise - uses      │
// │   setImmediate)       │
// └──────────┬────────────┘
//            │
// ┌──────────▼────────────┐
// │  setImmediate Queue   │
// └──────────┬────────────┘
//            │
//            └───────────────────>  [Bridge Crossing]
//                                         │
//                              ┌──────────▼──────────┐
//                              │  Native Processing  │
//                              │  - Layout           │
//                              │  - Render           │
//                              └──────────┬──────────┘
//                                         │
//            ┌────────────────────────────┘
//            │
// ┌──────────▼────────────┐
// │ requestAnimationFrame │
// │ (after frame ready)   │
// └──────────┬────────────┘
//            │
// ┌──────────▼────────────┐
// │ setTimeout/setInterval│
// └───────────────────────┘