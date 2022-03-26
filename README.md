# Arduino API

Web-Interface mit API-Backend-Server. Betrieben in zwei Containern auf der Google Cloud.

Funktionen der API:

- Arduinos verwalten und erstellen
- Arduinos ansprechen
- Daten von Ardunio Mikrocontrollern empfangen
- Loginsystem für User auf Basis von Session-basierter Authentifizierung
- Arduino Authentifizierung auf Basis von JWT Tokens

## Genutze Technologien

- Node.js JavaScript Runtime Environment
- Express.js Backend Framework
- JavaScript ES6
- SQLite3
- HTML5
- CSS (Precompiler: SCSS)

## Genutze Middleware & Software anderer

Middleware / Middlewarefunktionen haben Zugriff auf das HTTP Request und HTTP Response Objekt im Request -> Reponse Zyklus.
Middleware kann auf die Inhalte in Request und Reponse zugreiffen und sie verändern.

**Middleware:**

- Body-Parser (Macht den Body im HTTP Request Objekt lesbar und kompiliert diesen in verschiedene Formate wie JSON oder Text)
  
**NPM Pakete:**

- Node-Cache (Caching von Key-Value Pairs in Node.js)
- EJS (Server-Side Rendering mit Node.js)
