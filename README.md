# DrupalCraft
Drupalcraft is a gulp-based build system for Drupal. It provides structure for building, testing, and deploying Drupal sites.

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
### Configuration
Drupalcraft contains Drupal configuration files in it's root that allow you to define what a Drupal site should contain (Installation profile, contrib modules and themes, etc) and how it should be configured (`site.settings.php`). Here's a list of the files, and what they do:

* `local.settings.php` - Settings files that should contain settings for one's local environment.
* `site.settings.php` - Contains master module configurations and scopes, and other settings that should apply to all environments.
* `drupal.make` - A drush make file that defines what contrib projects should be downloaded, and what installation profile should be used, etc.

### Build System
Drupalcraft's build system is built using gulp, so running `gulp` in your command line will give you a documented list of available commands.

#### Building a Drupal site locally
Run `gulp build.local --builddir workdir --dbname myDatabaseName --dbuser myMysqlUsername --dbpass myMysqlPword`
