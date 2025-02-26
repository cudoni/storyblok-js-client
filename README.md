# Universal JavaScript SDK for Storyblok's API
[![npm (scoped with tag)](https://img.shields.io/npm/v/storyblok-js-client/latest.svg?style=flat-square)](https://npmjs.com/package/storyblok-js-client)

This client is a thin wrapper for the Storyblok API's to use in Node.js and the browser.


## Install

```sh
# as axios is a peerDependency, you should install it too
npm install storyblok-js-client axios # yarn add storyblok-js-client axios
```

## Usage

### Using the Content Deliver API

```javascript
// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client')

// 2. Initialize the client with the preview token
// from your space dashboard at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att'
})
```

### Using the Content Management API

```javascript
// 1. Require the Storyblok client
const StoryblokClient = require('storyblok-js-client')
const spaceId = 12345

// 2. Initialize the client with the oauth token
// from the my account area at https://app.storyblok.com
let Storyblok = new StoryblokClient({
  oauthToken: 'YOUR_OAUTH_TOKEN'
})

Storyblok.post(`spaces/${spaceId}/stories`, {story: {name: 'xy', slug: 'xy'}})
Storyblok.put(`spaces/${spaceId}/stories/1`, {story: {name: 'xy', slug: 'xy'}})
Storyblok.delete(`spaces/${spaceId}/stories/1`, null)
```

### Using the RichTextResolver separately

You can import and use the `RichTextResolver` directly:

```js
// you should need to use the format when import
// es - when you are in EsModules environment (like React, Vue apps, for example)
// cjs - when you are in NodeJS environment
// standalone - when you are in Browser environment directly

import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.es'
// const RichTextResolver = require('storyblok-js-client/dist/rich-text-resolver.cjs')

const resolver = new RichTextResolver()

const html = resolver.render(data)
```

### Using from the Browser directly

This package has a standalone version that contains all dependencies and you can use it to import and use our package inside the browser.

```html
<!-- This import makes the StoryblokClient class available globally -->
<script src="https://cdn.jsdelivr.net/npm/storyblok-js-client@4.0.5/dist/index.standalone.js"></script>

<!-- This import makes the RichTextResolver class available globally -->
<script src="https://cdn.jsdelivr.net/npm/storyblok-js-client@4.0.5/dist/rich-text-resolver.standalone.js"></script>
```

If you want a bundle with Babel (for non-es6 browsers):

```html
<!-- This import makes the StoryblokClient class available globally -->
<script src="https://cdn.jsdelivr.net/npm/storyblok-js-client@4.0.5/dist/es5/index.standalone.js"></script>

<!-- This import makes the RichTextResolver class available globally -->
<script src="https://cdn.jsdelivr.net/npm/storyblok-js-client@4.0.5/dist/es5/rich-text-resolver.standalone.js"></script>
```

### Note about use of Babel

This package doesn't use the Babel by default in the final bundle. So, if you want a Babel transpiled file, you need to set the `es5/` prefix on import:

```js
// for CommonJS environments (NodeJS)
const StoryblokClient = require('storyblok-js-client/dist/es5/index.cjs')

// for EsModules environments
import StoryblokClient from 'storyblok-js-client/dist/es5/index.es'
```

## Documentation

### Class `Storyblok`

**Parameters**

- `config` Object
  - `accessToken` String, The preview token you can find in your space dashboard at https://app.storyblok.com
  - `cache` Object
    - `type` String, `none` or `memory`
  - (`responseInterceptor` Function, optional - You can pass a function and return the result, like axios' interceptors. For security reasons, Storyblok client will deal only with the response interceptor.)
  - (`region` String, optional)
  - (`https` Boolean, optional)
  - (`rateLimit` Integer, optional, defaults to 3 for management api and 5 for cdn api)
  - (`timeout` Integer, optional)
  - (`maxRetries` Integer, optional, defaults to 5)
  - (`richTextSchema` Object, optional - your custom schema for RichTextRenderer)
- (`endpoint` String, optional)

### Activating request cache

The Storyblok client comes with a caching mechanism.
When initializing the Storyblok client you can define a cache provider for caching the requests in memory.
To clear the cache you can call `Storyblok.flushCache()` or activate the automatic clear with clear: 'auto'.

```javascript
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att',
  cache: {
    clear: 'auto',
    type: 'memory'
  }
})
```
### Passing response interceptor

The Storyblok client lets you pass a function that serves as a response interceptor to axios.
Usage:

```javascript
let Storyblok = new StoryblokClient({
  accessToken: 'xf5dRMMjltLzKOcNgMaU9Att',
  cache: {
    clear: 'auto',
    type: 'memory'
  },
  responseInterceptor: (response) => {
    // one can handle status codes and more with the response
    if (response.status === 200) {
      // handle your status here
    }
    // ALWAYS return the response
    return response
  },
})
```

### Method `Storyblok#get`

With this method you can get single or multiple items. The multiple items are paginated and you will receive 25 items per page by default. If you want to get all items at once use the `getAll` method.

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (can be `cdn/stories`, `cdn/tags`, `cdn/datasources`, `cdn/links`)
- `options` Object, Options can be found in the [API documentation](https://www.storyblok.com/docs/api/content-delivery).

**Example**

```javascript
Storyblok
  .get('cdn/stories/home', {
    version: 'draft'
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#getAll`

With this method you can get all items at once.

**Parameters**
- `[return]` Promise, Array of entities
- `path` String, Path (can be `cdn/stories`, `cdn/tags`, `cdn/datasources`, `cdn/links`)
- `options` Object, Options can be found in the [API documentation](https://www.storyblok.com/docs/api/content-delivery).
- `entity` String, Storyblok entity like stories, links or datasource. It's optional.

**Example**

```javascript
Storyblok
  .getAll('cdn/stories', {
    version: 'draft'
  })
  .then((stories) => {
    console.log(stories); // an array
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#post` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .post('spaces/12345/stories', {
    story: {name 'xy', slug: 'xy'}
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#put` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .put('spaces/12345/stories/1', {
    story: {name 'xy', slug: 'xy'}
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#delete` (only management api)

**Parameters**
- `[return]` Promise, Object `response`
- `path` String, Path (`spaces/*`, ... see more at https://www.storyblok.com/docs/management-api/authentication)
- `payload` Object

**Example**

```javascript
Storyblok
  .delete('spaces/12345/stories/1', null)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  })
```

### Method `Storyblok#flushCache`

**Parameters**

- `[return]` Promise, Object returns the Storyblok client

**Example**

```javascript
Storyblok.flushCache()
```

### Method `Storyblok#setComponentResolver`

**Parameters**

- `callback` Function, Render function to render components of the richtext field

Option 1: Use a switch case definition to render different components:

```javascript
Storyblok.setComponentResolver((component, blok) => {
  switch(component) {
    case 'my-custom-component':
      return `<div class="my-component-class">${blok.text}</div>`
      break;
    case 'my-header':
      return `<h1 class="my-class">${blok.title}</h1>`
      break;
    default:
      return 'Resolver not defined'
  }
})
```

Option 2: Dynamically render a component (Example in Vue.js):

```javascript
Storyblok.setComponentResolver((component, blok) => {
  return `<component :blok='${JSON.stringify(blok)}'
                     is="${component}"></component>`
})
```

### Method `Storyblok#richTextResolver.render`

**Parameters**
- `[return]` String, Rendered html of a richtext field
- `data` Richtext object, An object with a `content` (an array of nodes) field.

**Example**

```javascript
Storyblok.richTextResolver.render(blok.richtext)
```

## Code examples

### Filter by content type values and path

~~~javascript
const StoryblokClient = require('storyblok-js-client')

let client = new StoryblokClient({
  accessToken: 'zlRONoLBKrilxkz2k6fYuwtt'
})

// Filter by boolean value in content type
client.get('cdn/stories', {
    version: 'draft',
    filter_query: {
      is_featured: {
        in: true
      }
    }
  }).then((res) => {
    console.log(res.data.stories)
  })

// Get all news and author contents
client.get('cdn/stories', {
    version: 'draft',
    filter_query: {
      component: {
        in: 'news,author'
      }
    }
  }).then((res) => {
    console.log(res.data.stories)
  })

// Get all content from the news folder
client.get('cdn/stories', {
    version: 'draft',
    starts_with: 'news/'
  }).then((res) => {
    console.log(res.data.stories)
  })
~~~

### Download all content from Storyblok

Following a code example using the storyblok-js-client to backup all content on your local filesystem inside a 'backup' folder.

~~~javascript
const StoryblokClient = require('storyblok-js-client')
const fs = require('fs')

let client = new StoryblokClient({
  accessToken: 'WcdDcNgDm59K72EbsQg8Lgtt'
})

let lastPage = 1
let getStories = (page) => {
  client.get('cdn/stories', {
      version: 'draft',
      per_page: 25,
      page: page
    }).then((res) => {

    let stories = res.data.stories
    stories.forEach((story) => {
      fs.writeFile('./backup/' + story.id + '.json', JSON.stringify(story), (err) => {
        if (err) throw err

        console.log(story.full_slug + ' backed up')
      })
    })

    let total = res.total
    lastPage = Math.ceil((res.total / res.perPage))

    if (page <= lastPage) {
      page++
      getStories(page)
    }
  })
}

getStories(1)
~~~

### Initialize with a proxy server

~~~javascript
const proxy = {
  host: host,
  port: port,
  auth: {
    username: 'username',
    password: 'password'
  }
}

const storyblok = new StoryblokClient({
  ...
  https: false,
  proxy: proxy
})
~~~

Read more about proxy settings in axios [documentation](https://github.com/axios/axios)


### How to define a custom schema for the RichTextRenderer

To define how to add some classes to specific html attributes rendered by the rich text renderer, you need your own schema definition. With this new schema, you can pass it as the `richTextSchema` option when instantiate the `StoryblokClient` class. You **must** follow the [default schema](https://github.com/storyblok/storyblok-js-client/blob/master/source/schema.js) to do this.

Below, you can check an example:

~~~javascript
const StoryblokClient = require('storyblok-js-client')

// the default schema copied and updated
const MySchema = require('./my-schema')

let client = new StoryblokClient({
  accessToken: 'WcdDcNgDm59K72EbsQg8Lgtt',
  richTextSchema: MySchema
})

client.richTextResolver.render(data)
~~~

If you just want to change the way a specific tag is rendered you can import the default schema and extend it. Following an example that will render headlines with classes:

Instead of `<p>Normal headline</p><h3><span class="margin-bottom-fdsafdsada">Styled headline</span></h3>` it will render `<p>Normal headline</p><h3 class="margin-bottom-fdsafdsada">Styled headline</h3>`.

~~~javascript

const RichTextResolver = require('storyblok-js-client/dist/richTextResolver')
const MySchema = require('storyblok-js-client/dist/schema')

MySchema.nodes.heading = function(node) {
  let attrs = {}

  if (node.content &&
      node.content.length === 1 &&
      node.content[0].marks &&
      node.content[0].marks.length === 1 &&
      node.content[0].marks[0].type === 'styled') {
    attrs = node.content[0].marks[0].attrs
    delete node.content[0].marks
  }

  return {
    tag: [{
      tag: `h${node.attrs.level}`,
      attrs: attrs
    }]
  }
}

let rteResolver = new RichTextResolver(MySchema)
let rendered = rteResolver.render({
  "content": [
    {
      "content": [
        {
          "text": "Normal headline",
          "type": "text"
        }
      ],
      "type": "paragraph"
    },
    {
      "attrs": {
        "level": 3
      },
      "content": [
        {
          "marks": [
            {
              "attrs": {
                "class": "margin-bottom-fdsafdsada"
              },
              "type": "styled"
            }
          ],
          "text": "Styled headline",
          "type": "text"
        }
      ],
      "type": "heading"
    }
  ],
  "type": "doc"
})

console.log(rendered)
~~~

## Contribution

Fork me on [Github](https://github.com/storyblok/storyblok-js-client).

This project use [semantic-release](https://semantic-release.gitbook.io/semantic-release/) for generate new versions by using commit messages and we use the Angular Convention to naming the commits. Check [this question](https://semantic-release.gitbook.io/semantic-release/support/faq#how-can-i-change-the-type-of-commits-that-trigger-a-release) about it in semantic-release FAQ.
