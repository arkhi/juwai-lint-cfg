/* globals require */
(function() {
    'use strict';

    const exec   = require( 'child_process' ).exec;
    const config = require( '../package.json' );

    const devDependencies = config.devDependencies;
    const modulePath      = process.cwd();

    // Get the path of the main repository and its related npm binaries.
    // The path is based on the first occurrence of `/node_modules/` in the path.
    var rootLength     = modulePath.indexOf( '/node_modules/' ) + 1;
    var repositoryRoot = modulePath.slice( 0, rootLength );
    var command        = 'npm install --save-dev';
    var dependency;

    // Build command to execute based on dev dependencies
    for ( dependency in devDependencies ) {
        command += ` ${ dependency }@${ devDependencies[ dependency ] }`;
    }

    process.stdout.write(
        '--------------------------------------------------------------------------------\n'
        + 'I will now install linters as dependencies into “' + repositoryRoot + '”…\n'
    );

    /**
     * Execute command defined based on package\.json.
     *
     * @param {string}   command
     * @param {object}   options
     * @param {function} callback
     */
    exec(
        command,
        { 'cwd': repositoryRoot },
        function( error, stdout, stderr ) {
            if ( error ) {
                console.error(
                    'An error occured while installing linters:\n'
                    + error
                    + '\n--------------------------------------------------------------------------------\n\n'
                );

                return;
            }

            process.stdout.write(
                'Linters were installed successfully with ' + ( stderr
                    ? 'warnings: \n' + stderr
                    : 'no warning.'
                ) + '\n--------------------------------------------------------------------------------\n\n'
            );
        }
    );
})();
