"use strict";

var exec = require("child_process").exec;

// Package extension
var command = `tfx extension create --overrides-file config/release-manifest.json --manifest-globs vss-extension.json --no-prompt --json`;

exec(command, (error, stdout) => {
    if (error) {
        console.error(`Could not create package: '${error}'`);
        return;
    }
    console.log("Package created");
});

