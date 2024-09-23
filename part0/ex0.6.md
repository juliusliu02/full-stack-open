```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser executes the event handler that creates the note

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: return 201 created
    deactivate server
```