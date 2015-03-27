# Spotify Web API GraphQL

A proof of concept to create a [GraphQL](https://facebook.github.io/react/blog/2015/02/20/introducing-relay-and-graphql.html) compatible proxy to talk with the [Spotify Web API](https://developer.spotify.com/web-api/). It is based on [@cobbweb's GraphQL parser](https://github.com/cobbweb/graphqljs).

## Usage

### Install

```
$ npm install 
```

### Example

Suppose we would like to fetch some information from the Web API, defined by the following GraphQL query:

```
album(5CHfJNBnVafJEyYNiavoUi) {
  artists.first(1) {
    id,
    name
  },
  name,
  tracks.first(1) { id }
}
```

This will retrieve the album with id `5CHfJNBnVafJEyYNiavoUi` using the [Get an Album endpoint](https://developer.spotify.com/web-api/get-album/) and filter the returned fields to match the query.

```js
{
  "artists": [
    {
      "id": "6J6yx1t3nwIDyPXk5xa7O8",
      "name": "Vetusta Morla"
    }
  ],
  "name": "La Deriva",
  "tracks": [
    {
      "id": "1spx7pPpe3AGG2gIrsMbVm"
    }
  ]
}
```

### Demo

After cloning, install deps with `npm install`. You can see a demo running `npm run demo` which executes the exampple queries from the `examples` folder and dumps the parsed object to the console.

You can re-build the parser by running `npm run build`

#### TODO

 * Support all endpoints from the Web API
 * Issue several requests to fetch missing fields
 * Write tests
 * Implement an example using Relay