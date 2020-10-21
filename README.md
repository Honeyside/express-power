# express-power [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/express-power.svg
[npm-url]: https://www.npmjs.com/package/express-power

Express with superpowers! Effortless clustering, CLI logging & colors with Express.

<p align="center">
  <img src="https://www.honeyside.it/npm/express-power.png" alt="Express Power" width="474px" height="204px" />
</p>

## Installation

Install Express Power with yarn or npm:

```
yarn add express-power
```

```
npm install express-power
```

## Usage & Examples

Minimal example

```javascript
const Power = require("express-power");

const worker = app => {
    app.listen(4000, () => Power.log("Listening on port 4000".green));
};

Power.load({ worker });
```

Extended Example

```javascript
const Power = require('express-power');
const {log} = Power;

const master = () => {
    log("app started");
};

const worker = app => {
    app.use((req, res) => res.status(200).send("Hello World"));
    app.listen(4000, () => Power.log("Listening on port 4000".green));
};

let options = {
    workers: 8,
    logToFile: true,
    path: __dirname + "/power.log",
    master,
    worker,
};

Power.load(options);
```

In production, usage of [pm2](https://www.npmjs.com/package/pm2) to run your Express Power app is *strongly recommended*.

## Options

Power options you can use in `Power.load(options);`

| Option | Default Value | What it does |
| --- | --- | --- |
| workers | 2 | Number of workers.
| logToFile | false | Enable logging to file.
| path | appDirectory + '/power.log' | Log filename.
| master | () => {} | Function to execute before spawning master process. You can welcome the user and run pre-checks here.
| worker | () => {} | Function to execute after spawning worker process. Your Express app should be handled here.
| autoRestart | true | Restarts automatically a worker when it dies. Useful for keeping your process alive when unexpected errors occur.

## Full Reference

Require Express Power this way:

```ecmascript 6
const Power = require('express-power');
```

Now, the exported elements are:

```ecmascript 6
const {load, log, italy} = Power;
```

Let's see them in detail:

| Element | What it does | Proto |
| --- | --- | --- |
| load | Powers Express | load(options)
| log | Power logs to console | log(text)
| italy | Colors text as Italian flag | italy(text) / text.italy

Power options you can use in `load(main, options);`

| Option | Default Value | What it does |
| --- | --- | --- |
| workers | 2 | Number of workers.
| logToFile | false | Enable logging to file.
| path | appDirectory + '/power.log' | Log filename.
| master | () => {} | Function to execute before spawning master process. You can welcome the user and run pre-checks here.
| worker | () => {} | Function to execute after spawning worker process. Your Express app should be handled here.
| autoRestart | true | Restarts automatically a worker when it dies. Useful for keeping your process alive when unexpected errors occur.

*Notice: this package uses [Colors](https://www.npmjs.com/package/colors) internally, which extends the String prototype.*

## Contributing

Feel free to open an Issue or send me a direct message.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Sadkit/koa-power/tags). 

## Authors

* **Honeyside** - [Honeyside](https://github.com/Honeyside)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
