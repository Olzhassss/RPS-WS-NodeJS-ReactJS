# Rock Paper Scissors.

Author: Olzhas Toleutay [@Olzhasus](t.me/Olzhasus)

IP: [http://172.105.85.134](http://172.105.85.134) (UPD: disabled)

## Implementation info

- Client: ReactJS on Vite, Typescript, MobX, Bootstrap.
- Server: NodeJS, Express, ws library, Typescript.
- Communication with WebSockets.
- No cookies and authorization.
- No database.
- Number of players per match can be set through `/server/.env : MATCH_PLAYERS_NUMBER`. 2 by default.

## Todo

- Apache resource fallback to main index.html does not work for unknown reason. So, any URI aside from `/` and API's get Apache's 404 <=> no React Router's handling.
- SSL for https & wss.
- Session with cookies and authorization maybe.
- Production apps & server settings, security, protection, etc. +Instruction.
