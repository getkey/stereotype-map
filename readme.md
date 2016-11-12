# stereotype-map

A map of the stereotypes associated to the different nationalities.

## Install

```sh
$ npm install
$ stylus style.styl map.styl -o static/ # generate the css
$ node hook.js # start the server!
```

## API

You are free to use the API, but please do not abuse it.

```HTTP
GET stereotype-map/api/{country ISO 3166-1 alpha-2 code}.json
```

Example:

```HTTP
GET stereotype-map/api/DE.json
```

You will get a JSON-formatted array of stereotypes associated with the country you chose.
