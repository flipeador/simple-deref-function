# JS-simple-deref-function

## Examples

```js
/*
Cases:
    1) r'{}'      -> '{}' (empty variable name)
    2) r'\%'      -> '%' (valid escape sequence)
    3) r'\e'      -> '\\e' (invalid escape sequence)
    4) r'{var:f}' -> options.vars[options.fmt('var','f')] ?? '{var}' (variables)
    5) r'%0'      -> options.args[0] ?? '%0' (arguments)
    6) invalid variable names / non-matching cases
Output:
    {} | % | \e | {x} | y | zero | %1 | {y } 0%
*/
//                | 1 |   2 |  3  | 4.1 | 4.2 | 5.1| 5.2|      6 |
console.log(deref('{} | \\% | \\e | {x} | {y:f} | %0 | %1 | {y } 0%', {
    vars: { y: 'y' },  // '%y%' -> 'y'
    args: ['zero']  // '%0' -> 'zero'
}));
```

```js
/*
Output:
    Welcome -John- and _Jane_!
*/
console.log(deref('Welcome {user1:-} and {user2:_}!', {
    vars: { user1: 'John', user2: 'Jane' },
    fmt: (varname, format) => `${format}${varname}${format}`
}));
```

```js
/*
Aassuming environment variable 'SystemRoot' exists.
Output:
    C:\Windows\explorer.exe "file.txt" %*
*/
console.log(deref('{SystemRoot}\\explorer.exe "%1" %*', {
        args: [undefined, 'file.txt']
}));
```
