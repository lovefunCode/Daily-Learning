Array.prototype.myReduce = function (callback, initialVal){
    if(this === null){
       throw new TypeError('Array.prototype.myReduce called on null or undefined') 
    }
    if(typeof callback !== 'function'){
        throw new TypeError(callback + 'is not a function')
    }
    const array =  Object(this)
    const length = array.length >>> 0
    let accummulator;
    let startIndex = 0
    if(arguments.length >= 2){
        accummulator = initialVal
    }else{
        if(length == 0){
            throw new TypeError("reduce array is an empty array without initial value")
        }
        let found = false
        for(let i = 0; i < length; i++){
            if(i in array){
                accummulator = array[i]
                startIndex = i + 1
                found = true
                break
            }
        }
        if(!found){
            throw new TypeError("reduce array is an empty array without initial value")
        }
    }

    // execute callback for each element
    for(let i = 0; i < length; i++){
        if(i in array){
            accummulator = callback(accummulator, array[i], i, array)
        }
    }
    return accummulator
}

// Test cases
const arr = [ , 1, 3, 6, ,8, 0]
const sum = arr.myReduce((acc, currItem)=>{
    return acc + currItem
}, 0)

console.log("sum0---", sum)

// Use Case 2: Counting occurrences
const fruits = ['apple', 'banana', 'orange', 'apple', 'orange', 'banana', 'apple'];
const obj = fruits.myReduce((acc, fruit)=>{
    acc[fruit] = (acc[fruit] || 0) + 1 
    return acc
}, {})
console.log('obj----', obj)

// Use Case 3: Grouping objects by property
const people = [
    { name: 'Alice', age: 25, department: 'Engineering' },
    { name: 'Bob', age: 30, department: 'Sales' },
    { name: 'Charlie', age: 35, department: 'Engineering' },
    { name: 'Diana', age: 28, department: 'Sales' }
];

const groupedByDepartment = people.myReduce((acc, person)=>{
    const dep = person.department
    if(!acc[dep]){
        acc[dep] = []
    }
    acc[dep].push(people)
    return acc
}, {})

console.log(groupedByDepartment)
