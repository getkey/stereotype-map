# [stereotype-map](http://stereotypemap.info/)

A map of national stereotypes.

The data is taken from Google's search suggestions, for queries such as "why are the french so".

![search suggestion example](https://raw.githubusercontent.com/getkey/stereotype-map/master/google_search_suggestions.png)

The results are certainly not politically correct, and that's what makes it interesting and funny!

## Install

```sh
$ npm install --no-optional
$ node hook.js 8080 # start the server!
```

## API

You are free to use the API, but please do not abuse it.

```HTTP
GET stereotypemap.info/api/{country ISO 3166-1 alpha-2 code}.json
```

Example:

```HTTP
GET stereotypemap.info/api/DE.json
```

You will get a JSON-formatted array of stereotypes associated with the country you chose.

## Database

If you install the (optional) npm package `pg-promise`, data will be saved to a PostgreSQL database.

You must first create the tables (in the postgreSQL shell):
```
=> \i db/create.pgsql
```

You will need the file `db.json`, which contains your database credentials:

```JSON
{
	"host": "localhost",
	"port": 5432,
	"database": "stereotypemap",
	"user": "getkey",
	"password": "yourpassword"
}
```

## Credits

The map svg file is from [amCharts](https://www.amcharts.com/svg-maps/?map=world), distributed under the CC BY-NC 4.0.
