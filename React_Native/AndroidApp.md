0-50ms
🔧
Process Creation & Zygote Fork
MAIN
Android Zygote process forks new app process
Process allocates initial heap memory (50-100MB)
System framework classes already loaded (inherited from Zygote)
Framework services initialized (ActivityManager, PackageManager)
Critical: Fastest stage, system-optimized
↓
50-150ms
📱
Application.onCreate() Execution
MAIN
Application.onCreate() called by Android runtime
MultiDex installation (if APK has multiple DEX files)
Third-party SDK initialization (defer to background threads!)
ReactNativeHost instance created
Application-level singleton initialization
Bottleneck Risk: Heavy initialization blocks here
↓
150-250ms
🪟
Activity.onCreate() Execution
MAIN
ReactActivity.onCreate() invoked
Window manager setup and configuration
Status bar & navigation bar styling applied
React Native bridge initialization started (async)
ReactRootView created and attached
Activity enters waiting state for bridge readiness
↓
250-450ms
📦
JS Bundle Loading
BACKGROUND
AssetManager reads bundle from APK's assets/ folder
Bundle decompression if stored compressed (~200ms for large bundles)
File loaded into memory buffer (typical: 2-5MB)
Optimization: Use Hermes bytecode to skip parsing
Optimization: RAM bundles for faster module loading
Parallel loading possible with proper threading
↓
450-650ms
⚙️
JavaScript Engine Initialization
JS THREAD
Hermes Engine: VM creation + bytecode execution (no parsing!)
V8/JSC Engine: VM creation + parsing + compilation (~200ms overhead)
Global JavaScript context established
Core polyfills injected (Promise, Array methods, etc.)
Module registry prepared for native-JS communication
Hermes advantage: 50-100ms faster than V8
↓
650-850ms
🔗
Native Module Registry Build
MAIN
Reflection-based module discovery (expensive!)
Scans for @ReactModule annotations in Java/Kotlin classes
initialize() called on each native module
Method tables generated for JS-to-Native calls
Bridge marked as READY
Bottleneck: TurboModules (new architecture) eliminates upfront cost
↓
850-1200ms
⚛️
React Component Tree Execution
JS THREAD
AppRegistry.runApplication(appKey, App) invoked
Root React component mounted to virtual DOM
useState, useEffect, useContext hooks initialize
Component lifecycle methods executed (componentDidMount)
Initial state calculations and data fetching
Layout calculations performed (Yoga layout engine)
Shadow tree (native representation) constructed
Optimization: Lazy-load non-critical components
↓
1200-1500ms
🎨
Native View Rendering & Rasterization
RENDER
View hierarchy created from shadow tree
Native Android views instantiated (TextView, ImageView, etc.)
Views measured and laid out (onMeasure, onLayout)
RenderThread rasterizes views to GPU textures
Layer composition performed (hardware acceleration)
Framebuffer swap synchronized with vsync (~16.67ms intervals)
GPU optimizations: View caching, layer reduction
↓
~1500ms
🖼️
First Contentful Paint
RENDER
First pixels drawn to screen buffer
Splash screen dismissed (if configured)
User sees initial app content
Milestone: Time To Interactive (TTI) measured here