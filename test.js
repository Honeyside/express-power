const Power = require('./index');

const worker = app => {
    app.listen(4000, () => Power.log('Listening on port 4000'.green));
};

Power.load({ worker });
