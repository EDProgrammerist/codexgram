const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => { assert(name in mocks, `Unexpected dependency ${name}`); return mocks[name]; }, Map, Set, URL });
  return exports;
}
const externalReact = { useCallback: fn => fn, useSyncExternalStore: (_subscribe, snapshot) => snapshot() };
const seedComments = [{ id: 'seed', text: 'Demo', own: false }];
const comments = load('src/hooks/use-local-comments.ts', { react: externalReact, '@/data/demo-comments': { seedComments } });
const aliceComment = { id: 'alice-comment', text: 'Alice private draft', own: true };
let [alice, updateAlice] = comments.useLocalComments('alice', 'sarah-como');
updateAlice([...alice, aliceComment]);
assert.equal(comments.useLocalCommentDelta('alice')('sarah-como'), 1);
const [bob, updateBob] = comments.useLocalComments('bob', 'sarah-como');
assert(!bob.some(item => item.id === aliceComment.id));
updateBob(bob.filter(item => item.id !== aliceComment.id));
assert(comments.useLocalComments('alice', 'sarah-como')[0].some(item => item.id === aliceComment.id));
assert.equal(comments.useLocalCommentDelta('bob')('sarah-como'), 0);
assert.equal(comments.useLocalCommentDelta(null)('sarah-como'), 0);
assert.equal(comments.useLocalCommentDelta('alice')('sarah-como'), 1, 'remount/refresh derives retained delta');
let userId = null;
const saved = load('src/hooks/use-session-saved.ts', { react: externalReact, '@clerk/expo': { useAuth: () => ({ userId }) }, '@/data/demo-profile': { profilePhotos: [{ id: 'seed', saved: true }] } });
saved.useSessionSaved()[1](ids => [...ids, 'coast']);
assert(saved.useSessionSaved()[0].includes('coast'), 'second consumer sees Explore save');
saved.useSessionSaved()[1](ids => ids.filter(id => id !== 'coast'));
assert(!saved.useSessionSaved()[0].includes('coast'), 'Explore sees Profile unsave');
userId = 'alice'; saved.useSessionSaved()[1](() => ['private']);
userId = 'bob'; assert.equal(saved.useSessionSaved()[0].length, 0);
userId = 'alice'; assert(saved.useSessionSaved()[0].includes('private'));

(async () => {
  let states = [], refs = [], cursor = 0, refCursor = 0, result;
  let platform = 'web', redirected = 0, hosted = 0, activated = 0;
  const calls = [];
  const auth = load('src/hooks/use-social-auth.ts', {
    react: { useEffect: () => {}, useRef: value => refs[refCursor++] ?? (refs[refCursor - 1] = { current: value }), useState: value => { const i = cursor++; if (!(i in states)) states[i] = value; return [states[i], next => { states[i] = next; }]; } },
    '@clerk/expo': { useAuth: () => ({ isLoaded: true }), useClerk: () => ({ redirectToSignIn: async options => { assert.equal(options.signInForceRedirectUrl, '/'); redirected++; } }), useSSO: () => ({ startSSOFlow: async params => { calls.push(params); return result; } }), isClerkAPIResponseError: () => false },
    '@clerk/expo/hosted-auth': { useHostedAuth: () => ({ startHostedAuth: async () => { hosted++; } }) },
    'expo-auth-session': { makeRedirectUri: () => 'http://localhost:8082/sso-callback' },
    'expo-web-browser': {}, 'react-native': { Platform: { get OS() { return platform; } } },
  });
  const render = () => { cursor = 0; refCursor = 0; return auth.useSocialAuth(); };
  result = { authSessionResult: { type: 'success' }, signUp: { status: 'missing_requirements' } };
  await render().signIn('Google');
  assert(render().needsCompletion); assert.equal(render().pending, null);
  await render().completeSignIn(); assert.equal(redirected, 1); assert.equal(hosted, 0);
  platform = 'ios'; await render().completeSignIn(); assert.equal(hosted, 1);
  result = { createdSessionId: 'session-test', setActive: async ({session}) => { assert.equal(session, 'session-test'); activated++; } };
  await render().signIn('Apple'); assert.equal(activated, 1); assert(!render().needsCompletion);
  assert.equal(calls.at(-1).strategy, 'oauth_apple');
  result = { authSessionResult: { type: 'cancel' }, signUp: { status: 'missing_requirements' } }; await render().signIn('Google');
  assert.equal(render().error, null); assert.equal(render().pending, null);
  console.log('PASS: user-isolated comments and deletion, retained deltas, shared saved state and account isolation, web/native completion, session activation, cancellation.');
})().catch(error => { console.error(error); process.exit(1); });
