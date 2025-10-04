
// store the native method before overriding
const nativeObjectToString = Object.prototype.toString; 

Object.prototype.toString = function(){
    if(this === undefined){
        return '[object undefined]'
    }
    if(this === null){
        return '[object null]'
    }
    const O = Object(this)
    // (property) SymbolConstructor.toStringTag: typeof Symbol.toStringTag
    // A String value that is used in the creation of the default string description of an object.
    // Called by the built-in method Object.prototype.toString.
    let tag = O[Symbol.toStringTag]
     console.log('tag1----', tag) 
    // or direct to internal [[class]] detection
    const classString = nativeObjectToString.call(O).slice(8, -1)
    return classString
    // console.log('tag2----', tag) 

}
const str = '123456'
const arr = [1, 2, 3, 4]
const obj = {name: 'flora'}
const map = new Map([['name', 'flora'], ['age', '22'] ])

console.log(Object.prototype.toString.call(str))
console.log(Object.prototype.toString.call(arr))
console.log(Object.prototype.toString.call(obj))
console.log(Object.prototype.toString.call(map))