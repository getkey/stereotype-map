const Koa = require('koa'),
	router = require('koa-route'),
	app = new Koa(),
	model = require('./model.js');


if (app.env === 'development') { // on prod server nginx handles this
	const serve = require('koa-static');
	app.use(serve(__dirname + '/static'));
}


app.use(router.get('/api/:countryCode.json', async (ctx, countryCode) => {
	try {
		ctx.body = JSON.stringify(await model.getStereotypes(countryCode));
		ctx.status = 200;
	} catch (err) {
		ctx.body = 'Error: ' + err.message;
		ctx.status = 400;
	}
}));


app.use(async ctx => {
	ctx.body = '404 error: page not found';
	ctx.status = 404;
});

app.listen(parseInt(process.argv[2], 10));

console.log('The server is up !');
