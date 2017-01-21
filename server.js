const Koa = require('koa'),
	router = require('koa-route'),
	co = require('co'),
	render = require('koa-ejs'),
	app = new Koa(),
	model = require('./model.js');

let dev = app.env === 'development';
console.log('Dev mode set: ' + dev);

render(app, {
	root: __dirname + '/view',
	layout: false,
	viewExt: false,
	cache: !dev,
	debug: dev
});
app.context.render = co.wrap(app.context.render);

app.use(router.get('/', async ctx => {
	await ctx.render('index.ejs', {
		dev
	});
}));

app.use(router.get('/api/:countryCode.json', async (ctx, countryCode) => {
	try {
		ctx.body = JSON.stringify(await model.getStereotypes(countryCode));
		ctx.status = 200;
	} catch (err) {
		ctx.body = 'Error: ' + err.message;
		ctx.status = 400;
	}
}));


if (dev) { // on prod server nginx handles this
	const serve = require('koa-static');
	app.use(serve(__dirname + '/static'));
	app.use(serve(__dirname + '/node_modules/vue/dist'));
	app.use(serve(__dirname + '/node_modules/vuex/dist'));
	app.use(serve(__dirname + '/node_modules/github-fork-ribbon-css'));
}

app.use(async ctx => {
	ctx.body = '404 error: page not found';
	ctx.status = 404;
});

app.listen(parseInt(process.argv[2], 10));

console.log('The server is up !');
