/* globals require */
(function() {
    'use strict';

    var Promise = require( 'bluebird' );
    var fs      = require( 'fs' );

    var modulePath = process.cwd();
    var files = [
        '.csslintrc',
        '.editorconfig',
        '.jscsrc',
        '.jshintrc',
        '.stylelintrc'
    ];

    // Get the path of the repository, from the first occurrence of `/node_modules/`.
    var rootLength = modulePath.indexOf( '/node_modules/' ) + 1;
    var repositoryRoot = modulePath.slice( 0, rootLength );

    process.stdout.write(
        '--------------------------------------------------------------------------------\n'
        + 'I will now copy linters config files into “' + repositoryRoot + '”…\n'
    );

    // Exit current process only once all files are copied.
    copyFiles( repositoryRoot ).then(function() {
        process.stdout.write(
            'All the linters config files were copied successfully.'
            + '\n--------------------------------------------------------------------------------\n\n'
        );

        process.exit();
    });

    /**
     * Copy files to a specific folder.
     * This function uses promises to deal with latency between read and write operations.
     * Not doing so will lead to the creation of empty files.
     *
     * @see http://bluebirdjs.com/docs/api-reference.html
     *
     * @param {string} dest - Folder to copy the files to.
     */
    function copyFiles( dest ) {
        return Promise.all(
            files.map(function( file ) {
                var readFileAsync  = Promise.promisify( fs.readFile );
                var writeFileAsync = Promise.promisify( fs.writeFile );
                var fileRead       = readFileAsync( file );

                return fileRead.then( function( fileContent ) {
                    process.stdout.write( 'Copying ' + file + ' to ' + dest + file + '…\n' );

                    return writeFileAsync( dest + file, fileContent );
                });
            })
        );
    }
})();
