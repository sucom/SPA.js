'use strict';
var project = {
  name : ""
};

Object.defineProperty( project, 'securityCode', { value: "000-000-000" } );

console.log(Object.keys(project));

console.log( 'toString' in project );