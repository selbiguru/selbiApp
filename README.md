# selbiApp
selbi App application

# Libraries used

>https://github.com/animecyc/TitaniumAnimator

>https://github.com/pablorr18/TiFlexiGrid

>https://github.com/ricardoalcocer/alloy-widget-drawermenu

>https://github.com/MattMcFarland/com.mattmcfarland.fontawesome

# For generating documentation

## Requirements

It is a requirement to have **jsduck** installed already.  If you do not have it installed, you can do so via the following:

$ gem install jsduck

For more documentation about JSDuck, please visit the project: https://github.com/senchalabs/jsduck

## Installing the NPM package

From NPM: 

$ npm install titanium-jsduck -g

From Git:

$ npm install git://github.com/jamilhassanspain/titanium-jsduck.git

From source:

$ git clone git://github.com/jamilhassanspain/titanium-jsduck.git
$ cd titanium-jsduck
$ npm install -g
## Activating Documentation for your project

In order to use this NPM package, you must first be in the root of your Titanium Mobile Project. Either open a terminal window or use the Terminal inside Titanium Studio and run the following command:


titanium-jsduck install

## Viewing the Documentation

After your project has been compiled, you can now view the updated documentation. Instead of manually browsing to your Titanium Project in the finder, use this command:

$ titanium-jsduck open

## Generating Documentation 
There may be an instance where you want to generate documentation without actually re-compiling the Titanium Project.  For this corner case, the following command is available as well:

$ titanium-jsduck run


Refer Senchalabs Wiki for JSDuck at the following link:  https://github.com/senchalabs/jsduck/wiki/Guide.
