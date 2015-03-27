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

There is basic support for queries that result in several requests. For instance, take this query:

```
artist(0OdUWJ0sBjDrqHygGUXeCF) {
  name,
  followers { total },
  toptracks.first(5) {
    id,
    name,
    popularity
  }
}
```

Fetching the data involves a request to the endpoints [Get an Artist](https://developer.spotify.com/web-api/get-artist/) and [Get Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/). The adaptor will take care of it and will return this object:

```js
{
  "name": "Band of Horses",
  "followers": {
    "total": 347707
  },
  "toptracks": [
    {
      "id": "4o0NjemqhmsYLIMwlcosvW",
      "name": "The Funeral",
      "popularity": 74
    },
    {
      "id": "3LeNQIGi0zwmQm8WShZB95",
      "name": "No One's Gonna Love You",
      "popularity": 70
    },
    {
      "id": "5MYfpFJYm8WNFGssR6H2Oz",
      "name": "No One's Gonna Love You - Live from Spotify Sweden",
      "popularity": 69
    },
    {
      "id": "5qWgGPylB0Al9IVq2HKTHE",
      "name": "Is There A Ghost",
      "popularity": 61
    },
    {
      "id": "3MNTXYdBLLeBJjbihvTjOJ",
      "name": "The General Specific",
      "popularity": 58
    }
  ]
}

### Demo

After cloning, install deps with `npm install`. You can see a demo running `npm run demo` which executes the example queries from the `examples` folder and dumps the parsed object to the console.

You can re-build the parser by running `npm run build`

#### TODO

 * Support all endpoints from the Web API
 * Issue several requests to fetch missing fields. This is partially supported, but should cover cases like:
    - hydrating simple objects with full objects
    - using multi-get to resolve multiple requests for full tracks, full albums or full artists
 * Write tests
 * Implement an example using Relay