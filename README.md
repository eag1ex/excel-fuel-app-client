## Excel Fuel App

#### - [ Developed by Eaglex ](http://eaglex.net)

Client application displays available fuel stations on the map, using latitude/longitude targeting, with backend rest/api implementation, all authenticated via token. User can: **create**, **update** and **list** available stations in real time, application performs /auth check for every new token when server restarts.

Features:

-   Angular 11 MVC
-   Fullstack application
-   Api Authentication with router guards and resolvers
-   Good architecture and modular separations
-   Map api with open-source Leaflet.js
-   Module Lazy loading with Angular's multi-project feature
-   Material design with theme and bootstrap variables
-   Api proxy for development with environment variables
-   State management via RX.js service
-   Production ready
-   Linted

<br>

### <span style="color:red">Latest updates</span>

<i>Project demo is now available on github pages: </i>
**[ >> excel-fuel-app <<](https://eag1ex.github.io/excel-fuel-app-client/)**

<img src="./screens/excel-3.png" width="400" />
<br>
<br>

### Install

Application is fixed to `node@12.0.0` and `npm@6.9.0`, so install `nvm` manager when required.

-   You need to have installed: `excel-fuel-server` and running

```sh
$/ npm install
```

### Start

Will start `excel-fuel`, default app

```sh
$/ npm start # default app
```

-   Application runs on port 4444, open browser at `localhost:4444`, and it will proxy apis on `http://localhost:5000`
-   Make sure to start server application: `excel-fuel-server`, or it will route to error due to no token and api access.

### Build

To build for production just run, then copy the whole dir `excel-fuel` on server app inside: `/views/excel-fuel`

```sh
$/ npm run build # build at /dist
```

#### Live Demo

```sh
## OLD, INACTIVE

# Hosted on heroku node.js server (_server has timeout limit_, free dyno):

# access:
# https://pacific-meadow-55275.herokuapp.com/app
```

#### Server app repo

Excel fuel, typescript server app can be fount at

```sh
/$ git clone https://github.com/eag1ex/excel-fuel-server
```

### Stack

Angular 11, Leaflet.js, Material design, Bootstrap, x-utils-es _(my library)_, RX.js, State management, Resolvers, Router/guards, Api/token/authentication

### Code Architecture

Main project lives in `projects/excel-fuel` and components, http, services, utils are located in `/libs`

-   Application is prefixed with `@excel/{scopeName}` see tsconfig.json for more details
-   `@excel/data` provides application static data, and user credentials (for demo)
-   `@excel/utils` includes functional programming methods, extending functionality
-   `@excel/states` manage data states
-   `/libs/plugins` all vendor plugins are placed here, currently LeafletModule

**Diagram overview**

**(A) Project structure:**

-   Project/=> Excel Fuel
    -   Router/=> Lazy module >
        -   Locations (Component) >
            -   Search (Component)
            -   Station map create (component)
            -   Leaflet plugin module/=> Leaflet (component) >
                -   Station map update (component)

**(B) Routing:**

-   App (project)/=> main router
    -   Child routes:
        -   Locations >
            -   api/Stations Resolver
            -   Auth guard
            -   Search, Station/create, Leaflet > Station/update, components

**(C) Data flow:**

-   Lazy loaded (module) Locations route >
    -   Auth / guard
    -   Resolver >
        -   Http: api /stations >
            -   ExcelStates/stations (cached)
        -   Locations (component) >
            -   updatedStation$ (feeding latest changes to Leaflet and search components)
            -   Snapshot data ( api/stations )
            -   Station map create (component) >
                -   api: /create, /products
                -   update ExcelStates ( without http/requesting new updated list )
            -   Search (ExcelStates/stations) >
                -   ExcelStates/setUpdatedStation
            -   Leaflet component (listening updatedStation state changes from search ) >
                -   Station map update (component)
                    -   Inherits general leaflet controls
                    -   api: /update, /delete
                    -   ExcelStates/setUpdatedStation

#### Essential VSC plugins

-   Angular Essentials (Version 11) `johnpapa.angular-essentials`
-   Angular Language Service `angular.ng-template`
-   Angular Schematics `cyrilletuzi.angular-schematics`
-   Angular template formatter `stringham.angular-template-formatter`
-   Auto Import `steoates.autoimport`
-   Comment Anchors `exodiusstudios.comment-anchors`
-   Prettier - Code formatter `esbenp.prettier-vscode`
-   TSLint `ms-vscode.vscode-typescript-tslint-plugin`

#### Developer Notes

-   See environment variables at: `projects\excel-fuel\src\environments` for api configs
-   Not fully optimized for mobile
-   Wasn't entirely sure of logic for products/points (ExcelProductPoint[]) and how they should behave so implemented my own take on it:)
-   No preloader on start, will add later

#### TESTS

-   No tests available for this projects

#### Deadline

Initial deadline 9 days.

# Angular documentation at

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.0.

#### Thank you
