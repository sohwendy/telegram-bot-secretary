import test from 'ava';
const rewire = require('rewire');
const stub = require('../_stub');

let helper;
test.beforeEach(() => {
  helper = rewire('../../src/utility/bloomberg-scraper');
});

const html =
  '<meta itemprop="tickerSymbol" content="A" />' +
  '<meta itemprop="price" content=9.9 />' +
  '<meta itemprop="priceChange" content=0.11 />' +
  '<meta itemprop="quoteTime" content=E />';

const htmlData = {
  changeAmount: '0.11',
  code: 'A',
  price: '9.9',
  time: 'E',
};

test.serial('_constructUrl works', async t => {
  const expected = 'https://www.bloomberg.com/quote/one:two';
  const actual = helper._constructUrl('one', 'two');

  t.is(expected, actual);
});

test.serial('_constructUrl without suffix', async t => {
  const expected = 'https://www.bloomberg.com/quote/one';
  const actual = helper._constructUrl('one');

  t.is(expected, actual);
});

test.serial('_transform', async t => {
  const expected = htmlData;
  const actual = helper._transform(html);

  t.deepEqual(expected, actual);
});

test.serial('get works', async t => {
  const axiosMock = {
    get: (url, { transformResponse }) => {
      return { url, data: transformResponse(html) };
    }
  };
  helper.__set__('axios', axiosMock);

  const expected = htmlData;
  const actual = await helper.get('foo', 'bar');


  t.log('ex', expected); t.log('ac', actual);

  t.deepEqual(expected, actual);
});

test.serial('get handles exception', async t => {
  const axiosMock = { get: stub.exceptionMock };
  helper.__set__('axios', axiosMock);

  const expected = '';
  const actual = await helper.get('one', 'two');

  t.is(expected, actual);
});
