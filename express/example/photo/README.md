### 踩过的坑：

1. `enctype="multipart/form-data"`

`body-parser` 包不支持 `enctype="multipart/form-data"` 类型所以 `req.body` 一直为 `{}`

2.

```js
app.use(bodyParser.urlencoded({ extended: true }));
```

`extended` 为 `true` 才可以接收到 `photos[name]` 的数据

`extended` 解释：

> 当 `extended` 为 `false` 的时候，键值对中的值就为'String' 或 'Array' 形式，为 `true` 的时候，则可为任何数据类型。
