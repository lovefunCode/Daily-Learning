function permuation(arr){
    let res = []
    let visited = new Array(arr.length).fill(false)
    dfs([])
    function dfs(currArr){
        if(currArr.length === arr.length){
            res.push([...currArr])
            return
        }
        for(let i = 0; i < arr.length; i++){
            if(visited[i]) continue
            if(!visited[i-1] && arr[i] == arr[i-1]) continue
            currArr.push(arr[i])
            visited[i] = true
            dfs(currArr)
            currArr.pop()
            visited[i] = false
        }
    }
    return res
}

console.log(permuation([1,1,2,3]))