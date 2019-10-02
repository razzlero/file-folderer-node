const mock = require('mock-fs');

// Setup
// https://www.npmjs.com/package/mock-fs
mock({
  'path/to/fake/dir': {
    'some-file.txt': 'file content here',
    'empty-dir': {/** empty directory */},
  },
  'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
  'some/other/path': {/** another empty directory */},
});

// Tests
test('simple pass', () => {
  expect(1).toBe(1);
});

test('simple fail', () => {
  expect(1).toBe(2);
});

// Cleanup
mock.restore();
