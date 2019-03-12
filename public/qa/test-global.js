suite('Global Tests', function() {
  test('Page has valid header', function() {
    assert(document.title && document.title.match(/\S/) &&
      document.title.toUpperCase() !== 'TODO');
  });
});

