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
  var self = this;
  var baseDir = process.cwd();
  this.mkdir('src');
  this.mkdir('src/fw1');
  this.mkdir('src/di1');

  this.mkdir('org');
  this.mkdir('org/corfield');

  console.log( "INFO: Retrieving FW/1 from GitHub repo" );

  this.cloneRepo( 'git@github.com:framework-one/fw1.git', baseDir + '/src/fw1', function( err, success ){
    
    console.log( "INFO: Moving FW/1 files into place" );

    //Move the framwork CFC into its folder
    self.copy( baseDir + '/src/fw1/org/corfield/framework.cfc', 'org/corfield/framework.cfc' );

    //Move the skeleton files into their respective folders
    self.copy( baseDir + '/src/fw1/skeleton/Application.cfc', 'Application.cfc');

  })

  if( this.includeDI1 == true ){
      console.log( "INFO: Retrieving DI/1 from GitHub repo" );
      this.cloneRepo( 'git@github.com:framework-one/di1.git', baseDir + '/src/di1', function( success ){
        console.log( success );
        console.log( "INFO: Moving DI/1 files into place" );

        self.copy( baseDir + '/src/di1/ioc.cfc', 'org/corfield/ioc.cfc');

      })
  }

};

Fw1Generator.prototype.cloneRepo = function cloneRepo( repoPath, localPath, callback ) {
  
  //require('simple-git')( baseDir + localPath )
  //  .clone( repoPath, localPath );

  
  require('simple-git')( baseDir + localPath )
     .init()
     .addRemote( 'origin', repoPath )
     .fetch()
     .checkout( 'master' );
  
  //   callback( true );

}