import test from 'ava';
import * as model from '../model.js';

test('so is part of a word', async t => {
	let stereotype = model.questionToStereotype('why are british soldiers called tommies');
	t.is(stereotype, null);
});

test('nothing after beginning of question', async t => {
	let stereotype = model.questionToStereotype('why are the french so');
	t.is(stereotype, null);
});

test('normal question', async t => {
	let stereotype = model.questionToStereotype('why are spaniards so loud');
	t.is(stereotype, 'loud');
});
