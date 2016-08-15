'use strict';
var project = {};

Object.defineProperty( project, 'securityCode'
                              , { value: "123-65-6879", writable:true } );

project.securityCode = "Changed";

console.log(project);