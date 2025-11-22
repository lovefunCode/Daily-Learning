┌─────────────────────────────────────────────────────────┐
│                        React (Core)                      │
│                                                          │
│  - Component model                                       │
│  - Hooks (useState, useEffect, etc.)                     │
│  - Virtual DOM diffing algorithm                         │
│  - Reconciliation logic                                  │
│  - JSX transformation                                    │
│  - Component lifecycle                                   │
│                                                          │
│  (Platform-agnostic - doesn't know about DOM or Mobile)  │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴─────────┐
        │                  │
        ▼                  ▼
┌───────────────┐  ┌──────────────────┐
│  React-DOM    │  │React-Native(fabric) │
│               │  │                  │
│  - DOM APIs   │  │  - Native APIs   │
│  - Browser    │  │  - iOS/Android   │
│  - <div>      │  │  - <View>        │
│  - <span>     │  │  - <Text>        │
│  - Events     │  │  - Native events │
│               │  │  - Bridge        │
└───────────────┘  └──────────────────┘