# Firebasify

A tool for restructing your json files to make array-indexing possible in Firebase.

## Why
Imagine you have an array stored at Firebase Realtime Database, and you want to get value of an item with a specific `id` (or any unique key identifier). What do you need to do is get the whole array then find the item with that `unique id` in it. This means you should iterate over the array of data.

But, what if we store items of that array as `values` of an object and its unique identifier as `key`? We can just get the data with its key.

In JavaScript,
```javascript
let reference = ref(db, 'posts/' + postId);
```
will be the reference of the item with the `unique id` of `posts`.

## Usage

Firebasify can be used as both a library and a command line tool.

### CLI
```
Usage: npx firebasify <input-file> <output-file> [options]

Options:
  -V, --version                  output the version number
  -r, --rule [rules...]          specify rules
  -u, --unique-key <unique-key>  specify unique key (default: "id")
  -h, --help                     display help for command

Example:
  $ npx firebasify old.json new.json --rule id:/posts
```
#### Rules
`Rules` defines "Where to firebasify in object?" and "What should be used as unique key". When no unique key defined, default unique key will be used.

Syntax:

- `'unique-key:/path/to/array'`

- `'/path/to/array'` (default unique key will be passed)

### Library
Import the `firebasify` function to your code. And pass the object and and the [rules](#rules).

Syntax:
```javascript
import firebasify from "firebasify";

let newObj = firebasify(oldObj, ['unique-key:/path/to/array']);
```

## Example Usage

`old.json`:
```json
{
    "posts": [
        {"id": 1, "content": "lorem"},
        {"id": 2, "content": "ipsum"},
        {"content": "dolor"}
    ]
}
```
Run this command:
```
npx firebasify old.json new.json -r /posts
```

or

```
npx firebasify old.json new.json -r id:/posts
```


`new.json`:
```json
{
    "posts": {
        "2": {"id": 2, "content": "ipsum"},
        "3": {"content": "lorem", "id": 3},
        "4": {"content": "dolor", "id": 4}
    }
}
```
