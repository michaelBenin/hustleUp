module("hustleUp tests");

test("Namespace test", 2 /* Number of tests */, function () {

    equal( typeof($.fn.hustleUp), 'function', 'Hustle up is a namespace on $');

    strictEqual( 'val', 'val', 'Test to see if it\'s strictly equal and why.' );

});

