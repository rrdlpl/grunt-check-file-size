/*
 * grunt-check-file-size
 * https://github.com/rrdlpl/grunt-check-file-size
 *
 * Copyright (c) 2016 Roberto R. D. L.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function dumpDebugInformation(target) {
    var options = target.options();    
    if (!options.debug) {
      return;
    }
    grunt.log.writeln("Running target: " + target.target);
    grunt.log.writeflags(options, 'Target Options');
    target.filesSrc.forEach(function (filepath) {
      grunt.log.writeln("Configured Folder: " + filepath);
    });
  }

  function verifyFolderExists(folderPath) {
    if (folderPath === "" || folderPath === undefined) {
      grunt.fail.fatal("The provided folderToscan was empty or not provided");
    }
    if (!grunt.file.exists(folderPath)) {
      grunt.fail.fatal("The provided folderToScan was not found");
    }
    if (!grunt.file.isDir(folderPath)) {
      grunt.fail.fatal("The provided folderToScan was not a folder");
    }
  }

  function checkFileSizes(target) {
    target.filesSrc.forEach(function (folderPath) {
      if (grunt.file.isDir(folderPath)) {
        grunt.file.recurse(folderPath, function (abspath, rootdir, subdir, filename) {
          if (grunt.file.isFile(abspath)) {
            var stats = fs.statSync(abspath);
            var asKBytes = stats.size / 1024;
            grunt.log.writeln("Found file %s with size of %s kb", filename, asKBytes);
          }
        });
      }else{
        grunt.log.writeln(folderPath + " is not a folder");
      }
    });
  }

  grunt.registerMultiTask('checkFileSize', 'The best Grunt plugin ever.', function () {
    var options = this.options({
      debug: false
    });
    dumpDebugInformation(this);
    //verifyFolderExists(options.folderToScan);
    checkFileSizes(this);    
  });
};
