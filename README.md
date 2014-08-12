fs-modules
=============

JavaScript and Angular components that work in conjunction with fs-styles

## How to Use

fs-modules comes with both Angular.js directives and native JavaScript functions. 

To include only the Angular directives, add `ng-fs-modules.js` to your JS assets. 

To include only the native JavaScript functions, include `fs-modules.js`. If your app does not have Angular running, you will also need to include `fs-modules/ngParser.js` before you include `fs-modules.js`.

## Angular Directives

### fs-person-vitals

Outputs a person's full name, lifespan, and pid.
  
Usage:
```javascript
<fs-person-vitals data-person="person" data-config="{hideId: true, lifeSpan: 'long'}"></fs-person-vitals>
```

**person:** An object that can have properties of `name`, `id`, and `lifeSpan`.

**config:** An object that sets different display options for the person.  
**{boolean} [config.hideLifeSpan=false]:** Hide the lifespan.  
**{string} [config.lifeSpan=short]:** Show the short or the full lifeSpan (short,long).  
**{boolean} [config.hideId=false]:** Hide the person id.  
**{boolean} [config.openPersonCard=false]:** Add a link to open the person card when the name is clicked.

### fs-person-gender

Outputs a person's gender icon and their full name, lifespan, and pid.
  
Usage:
```javascript
<fs-person-gender data-person="person" data-config="{iconSize: 'small'}"></fs-person-gender>
```

**person:** An object that can have properties of `name`, `id`, and `lifeSpan`.

**config:** An object that sets different display options for the person.  
**{boolean} [config.hideLifeSpan=false]:** Hide the lifespan.  
**{string} [config.lifeSpan=short]:** Show the short or the full lifeSpan (short,long).  
**{boolean} [config.hideId=false]:** Hide the person id.  
**{boolean} [config.openPersonCard=false]:** Add a link to open the person card when the name is clicked.  
**{string} [config.iconSize=medium]:** Size of the gender icon (small,medium).  

### fs-person-portrait

Outputs a person's portrait, gender icon, and their full name, lifespan, and pid.
  
Usage:
```javascript
<fs-person-portrait data-person="person" data-config="{iconSize: 'small'}"></fs-person-portrait>
```

**person:** An object that can have properties of `name`, `id`, and `lifeSpan`.

**config:** An object that sets different display options for the person.  
**{boolean} [config.hideLifeSpan=false]:** Hide the lifespan.  
**{string} [config.lifeSpan=short]:** Show the short or the full lifeSpan (short,long).  
**{boolean} [config.hideId=false]:** Hide the person id.  
**{boolean} [config.openPersonCard=false]:** Add a link to open the person card when the name is clicked.  
**{string} [config.iconSize=medium]:** Size of the gender icon (small,medium).   
**{boolean} [config.hideGender=false]:** Hide the gender icon. 

### fs-couple-info

Outputs a couple relationship and displays each person's gender icon and their full name, lifespan, and pid.
  
Usage:
```javascript
<fs-couple-info data-husband="husband" data-wife="wife" data-config="{iconSize: 'small'}"></fs-couple-info>
```

**husband:** The top person to display. An object that can have properties of `name`, `id`, and `lifeSpan`.

**wife:** The bottom perosn to display. An object that can have properties of `name`, `id`, and `lifeSpan`.

**config:** An object that sets different display options for the person.  
**{boolean} [config.hideLifeSpan=false]:** Hide the lifespan.  
**{string} [config.lifeSpan=short]:** Show the short or the full lifeSpan (short,long).  
**{boolean} [config.hideId=false]:** Hide the person id.  
**{boolean} [config.openPersonCard=false]:** Add a link to open the person card when the name is clicked.  
**{string} [config.iconSize=medium]:** Size of the gender icon (small,medium).  

**NOTE:** You cannot set the display options separately for each person, both the husband and the wife will have the same display options.

## JavaScript Functions

Each JavaScript function returns a native HTMLElement.

### fsModules.fsPersonVitals

Usage:
```javascript
var dom = fsModules.fsPerosnVitals(person, {hideIcon: true, lifeSpan: 'long'});
```

Parameters are the same as the Angular directive of the same name.

### fsModules.fsPersonGender

Usage:
```javascript
var dom = fsModules.fsPerosnGender(person, {iconSize: 'small'});
```

Parameters are the same as the Angular directive of the same name.

### fsModules.fsPersonPortrait

Usage:
```javascript
var dom = fsModules.fsPerosnPortrait(person, {iconSize: 'small'});
```

Parameters are the same as the Angular directive of the same name.

### fsModules.fsCoupleInfo

Usage:
```javascript
var dom = fsModules.fsCoupleInfo(person, {iconSize: 'small'});
```

Parameters are the same as the Angular directive of the same name.

## License
Copyright © 2014 by Intellectual Reserve, Inc. See the LICENSE file for license rights and limitations.
