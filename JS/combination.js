const arr  = ["a", 1, 1, 'b', 'c']

function combination(arr){
    let res = []
    function dfs(index, currArr){
        if(currArr.length <= arr.length){
            res.push([...currArr])
        }
        for(let i = index; i < arr.length; i++){
            // skip too much, if pick the 1, and the second is the 1, then will skip
            // if( arr[i] === arr[i-1]) continue
            if(i > index && arr[i] === arr[i-1]) continue
            currArr.push(arr[i])
            dfs(i + 1, currArr)
            currArr.pop()
        }
    }

    dfs(0, [])
    return res
}

console.log(combination(arr))