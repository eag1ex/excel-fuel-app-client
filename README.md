## Excel Fuel App
Client application displays available fuel stations on the map, using latitude/longitude targeting, with backend rest/api implementation, all authenticated via token. User can: **create**, **update** and **list** available stations in real time, application performs /auth check for every new token when server restarts.

Features:
- Angular 11 MVC
- Fullscak application
- Api Authentication with router guards and resolvers 
- Good architecture and modular seperations
- Map api with opensource Leaflet.js
- Module Lazy loading with Angulars multi-project feature
- Material desing with theme and bootstrap variables
- Api proxy for development with environment variables
- State management via RX.js service
- Production ready


### Install
Application is fixed to `node@12.0.0` and `npm@6.9.0`, so install `nvm` manager when required.

```sh
$/ npm install
```

### Start

Will start `excel-fuel`, default app
```sh
$/ npm start # default app
```

- Application runs on port 4444, open browser at `localhost:4444`, and it will proxy apis on `http://localhost:5000`
- Make sure to start server application: `excel-fuel-server`, or it will route to error due to no token and api access. 



### Stack
Angular 11, Leaflet.js, Material desing, Bootstrap, x-utils-es _(my library)_, RX.js, State management, Resolvers, Router/guards, Api/token/authentication 


# Angular documentation at
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.0.
