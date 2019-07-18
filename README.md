# apoejs-webpack-loader for webpack 4.x

Fork from ejs-webpack-loader (https://github.com/rorkflash/ejs-webpack-loader), Ashot Gasparyan <rorkflash@gmail.com>

# apoejs-webpack-loader for webpack 4.x

Fork from ejs-webpack-loader (https://github.com/rorkflash/ejs-webpack-loader), Ashot Gasparyan <rorkflash@gmail.com>

Main difference is that there is an option to use qs.stringify to pass params

# Examples

```javascript
module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [{
          loader: 'apoejs-webpack-loader',
          options: {
            htmlmin: true,
            htmlminOptions: { removeComments: true }
          }
        }],
      }
    ]
  },
```

or

```javascript
new HTMLWebpackPlugin({
            template: `html-loader!extract-loader!apoejs-webpack-loader?${qs.stringify(some)}!views/main.ejs`,
            filename: 'index.html',
            chunks: ['main'],
            inject: 'head',
            minify: {
                removeComments: true,
                collapseWhitespace: false,
            },
        }),
```

or

```javascript
new HTMLWebpackPlugin({
            template: `html-loader!extract-loader!apoejs-webpack-loader?${JSON.stringify(some)}!views/main.ejs`,
            filename: 'index.html',
            chunks: ['main'],
            inject: 'head',
            minify: {
                removeComments: true,
                collapseWhitespace: false,
            },
        }),
```

JSON.stringify can produce '!' in some cases which is not valid for template "url", so qs could be used.
