'use strict';
var project = {};

Object.defineProperty( project, 'securityCode'
                              , { value: "000-000-000", configurable: true } );

Object.defineProperty( project, 'securityCode', { value: "999-999-999" } );

console.log(project);