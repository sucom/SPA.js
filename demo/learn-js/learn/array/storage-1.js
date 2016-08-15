var n1 = 10;

var n2 = n1;

n1 = 20;

console.log(n2);

/*
 * n1 and n2 are two different memory locations
 * 
 * n2 is new memory location with value copied from mem.loc of n1 at the time of creation
 * 
 */