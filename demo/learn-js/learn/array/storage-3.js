var obj1 = {
  name: 'Javascript'
};

var obj2 = obj1;

obj1.name = "Java";

console.log(obj2);

/*
 * When obj1 created, the actual content is stored in a memory location
 * and the pointer to that location is stored in obj1's memory location
 * 
 * Object(s) memory locations are different memory locations 
 * to store pointer to a location of actual objects in a memory
 * 
 * when obj2 created:
 * a new memory location created with the copy of pointer 
 * stored in obj1's location
 *
 * obj1:[pointer-A]
 * 
 * obj2:[pointer-A]
 * 
 * Pointer-A: {
 *  name: 'Javascript'
 * }
 * 
 */