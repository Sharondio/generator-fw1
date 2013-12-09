'use strict';
var baseDir = process.cwd();
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');



var Fw1Generator = module.exports = function Fw1Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  
  this.on('end', function () {
    //this.installDependencies({ skipInstall: options['skip-install'] });
  });

  //this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(Fw1Generator, yeoman.generators.Base);

Fw1Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
  {
    type: 'confirm',
    name: 'includeDI1',
    message: 'Would you like to include DI/1?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.includeDI1 = props.includeDI1;
    cb();
  }.bind(this));
};

Fw1Generator.prototype.app = function app() {
  var app = this;
  var baseDir = process.cwd();

  this.mkdir('src');
  this.mkdir('src/fw1');
  

  this.mkdir('org');
  this.mkdir('org/corfield');

  console.log( "INFO: Retrieving FW/1 from GitHub repo" );

  this.cloneRepo( 'git@github.com:framework-one/fw1.git', baseDir + '/src/fw1', function (err) {
    console.log("cloning.done");
    this.copyDirs();
  });

  
  if( this.includeDI1 ){

      this.mkdir('src/di1');
      console.log( "INFO: Retrieving DI/1 from GitHub repo" );
      this.cloneRepo( 'git@github.com:framework-one/di1.git', baseDir + '/src/di1', function( err ){
        
        console.log( "INFO: Moving DI/1 files into place" );

        app.copy( baseDir + '/src/di1/ioc.cfc', baseDir + '/org/corfield/ioc.cfc');

      })
  }
  
};

Fw1Generator.prototype.copyDirs = function copyDirs () {
  var cb = this.async();
  console.log( "INFO: Moving FW/1 files into place - " + baseDir );
  //Move the framwork CFC into its folder
  this.copy( baseDir + '/src/fw1/org/corfield/framework.cfc', baseDir + '/org/corfield/framework.cfc' );
  //Move the skeleton files into their respective folders
  this.copy( baseDir + '/src/fw1/skeleton/Application.cfc', baseDir + '/Application.cfc');
  cb();
}

Fw1Generator.prototype.cloneRepo = function cloneRepo( repoPath, localPath ) {
  
  var cb = this.async();

  if( repoPath && localPath ){

    require('simple-git')( localPath )
    .clone( repoPath, localPath, cb );

    /*
    require('simple-git')( localPath )
       .init()
       .addRemote( 'origin', repoPath )
       .fetch()
       .checkout( 'master', callback );
    */
    
  }
  

}