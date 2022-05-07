# Arduino API

Web-Interface mit API-Backend-Server. Betrieben in zwei Containern auf der Google Cloud.

Funktionen der API:

- Arduinos verwalten und erstellen
- Arduinos ansprechen
- Daten von arduino Mikrocontrollern empfangen

## Genutze Technologien

- Node.js JavaScript Runtime Environment
- Express.js Backend Framework
- JavaScript ES6
- Redis
- HTML5
- CSS (Precompiler: SCSS)

## Genutze Middleware & Software anderer

Middleware / Middlewarefunktionen haben Zugriff auf das HTTP Request und HTTP Response Objekt im Request -> Reponse Zyklus.
Middleware kann auf die Inhalte in Request und Reponse zugreiffen und sie verändern.

**NPM Pakete:**

- RedisClient https://github.com/redis/node-redis
- Socket.io https://socket.io/
