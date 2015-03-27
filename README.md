# DrupalCraft
Drupalcraft is a build system for drupal that provides structure for building, testing, and deploying Drupal sites.

Drupalcraft consists of 3 components:

* Drupal files (`drupal.make`, `site.settings.php`, `modules/`, `themes/`, etc).
* Set of build tools that takes the Drupal files and constructs a Drupal site.
* A pluggable deployment system that allows one to implement build tools so that Drupal sites can be built in different environemnts. (Local and Docker support is currently working, upcoming is Pantheon, Acquia, Vagrant, etc.)

## Installation
* Clone drupalcraft.
* Run `npm install` within the drupalcraft root.
* Run `gulp` to see the CLI documentation.
* Build a drupal site!

## Use
### 1. Configurations
Drupalcraft contains Drupal configuration files in it's root that allow you to define what a Drupal site should contain (Installation profile, contrib modules and themes, etc) and how it should be configured (`site.settings.php`). Here's a list of the files, and what they do:

* `local.settings.php` - Settings files that should contain settings for one's local environment.
* `site.settings.php` - Contains master module configurations and scopes, and other settings that should apply to all environments.
* `drupal.make` - A drush make file that defines what contrib projects should be downloaded, and what installation profile should be used, etc.

### 2. Build System
Drupalcraft's build system is built using gulp, so running `gulp` in your command line will give you a documented list of available commands.

### 3. Deployment System
Drupalcraft contains a `_deployments` folder, which contains sub-folders that hold the code nesseccary to build a Drupal site against a specific environment.

You can enable/disable or configure the enabled deployment options by modifying the `deployments` object within `package.json`.

#### Local Deployment
Run `gulp build.local --builddir workdir --dbname myDatabaseName --dbuser myMysqlUsername --dbpass myMysqlPword`

#### Docker Deployment
Documentation coming soon :)

### Adding deployment options
Adding a deployment option is quite simple:

* Add a folder within `_deployments`. This folder will hold the tools necessary to successfully deploy a Drupal site to your environment.
* Create a `_task.js` file within your new folder. This should contain a gulp task that facilitates the build and deployment of Drupal. Here's an example:

```
/**                                                                                                                        
 * @file                                                                                                                   
 * Defines a deployment task that uses build tools to                                                                
 * build a drupal site on an environment                                                                             
 */                                                                                                                        
/* globals require */                                                                                                      
                                                                                                                           
var gulp = require('gulp'),                                                                                                                                                                                                
    options = require('minimist')(process.argv.slice(2));                                                                  
                                                                                                                           
/**                                                                                                                        
 * @task deploy.myEnvironment                                                                                                       
 *   Constructs a working Drupal site on myEnvironment                                                              
 *                                                                                                                         
 * @param string options.builddir                                                                                          
 *   Name of subdirectory in which this project should be built.                                                           
 * @param string options.dbname                                                                                            
 *   Name of database in which Drupal should be installed.                                                                 
 * @param string options.dbuser                                                                                            
 *   Mysql user that Drupal should use.                                                                                    
 * @param string options.dbpass                                                                                            
 *   options.dbuser's password.                                                                                            
 */                                                                                                                        
gulp.task('deploy.myEnvironment', 'Constructs a working Drupal site on myEnvironment.', function () {                 
  // Make sure required options exist.                                                                                                                     
  if (!options.hasOwnProperty('dbname') || options.dbname.length <= 0) {                                                   
    throw new gutil.PluginError('build', 'You must pass in a --dbname setting.');                                          
  }                                                                                                                        
                                                                                                                           
  if (!options.hasOwnProperty('dbuser') || options.dbuser.length <= 0) {                                                   
    throw new gutil.PluginError('build', 'You must pass in a --dbuser setting.');                                          
  }                                                                                                                        
                                                                                                                           
  if (!options.hasOwnProperty('dbpass') || options.dbpass.length <= 0) {                                                   
    throw new gutil.PluginError('build', 'You must pass in a --dbpass setting.');                                          
  }                                                                                                                        
                                                                                                                                                                               
  // SSH into a machine.
  // Checkout repo out a given branch.
  // Set up database.
  // Run build tools.                                                                                                                    

  // Last parameter in gulp.task is an object containing an options key.
  // The options key contains an object with properties describing the 
  // available deployment options.
}, {                                                                                                                       
  options: {                                                                                                               
    'builddir': 'Directory within /builds in which site should be constructed.',                                           
    'dbname': 'Name of database in which Drupal should be installed.',                                                     
    'dbuser': 'Mysql user that Drupal should use to log into mysql.',                                                      
    'dbpass': 'Password of mysql user that Drupal should use to log into mysql'                                                                   
  }                                                                                                                        
}); 
```

* Once you have created a gulp task that deploys Drupal to your environment, you can enable the new deployment option by adding an item to the `deployments` object within `package.json`, like so:

```
"deployments": {                                                                                                         
  "myEnvironment": "_deployments/my_environment/_task.js",                                                                                                                                                                            
} 
```

* run `gulp`, and you should see your task listed in the CLI help text.

