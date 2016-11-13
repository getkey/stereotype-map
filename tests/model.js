import test from 'ava';
import * as model from '../model.js';

test('so is part of a word', async t => {
	let stereotype = model.questionToStereotype('why are british soldiers called tommies', 'GB');
	t.is(stereotype, null);
});

test('nothing after beginning of question', async t => {
	let stereotype = model.questionToStereotype('why are the french so', 'FR');
	t.is(stereotype, null);
});

test('so many', async t => {
	let stereotype = model.questionToStereotype('why are Indian so many', 'IN');
	t.is(stereotype, null);
});

test('normal question', async t => {
	let stereotype = model.questionToStereotype('why are spanish so loud', 'ES');
	t.is(stereotype, 'loud');
});

test('normal question ("the" version)', async t => {
	let stereotype = model.questionToStereotype('why are the spanish so loud', 'ES');
	t.is(stereotype, 'loud');
});
