import test from 'ava';

const helper = require('../../src/lib/json-file-helper');


const log = () => {};

test('get works', async t => {
  const expected = {
    chatId: '<telegram_chat_id>',
    token: '<telegram_bot_token>'
  };
  const actual = await helper.get('sample/chat.json', log);

  t.deepEqual(expected, actual);
});


test('get handles exception', async t => {
  const expected = { }
  const actual = await helper.get('sample/chat', log);

  t.deepEqual(expected, actual);
});
