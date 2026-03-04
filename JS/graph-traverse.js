//       A
//    / \  \  \
//   B   C   G  M
//  / \   \
// D   E   F

const graph = {
    'A' : ["B", "C", "G", "M"],
    'B' : ["D", "E"],
    'C' : ['F'],
    'D' : [],
    'E' : [],
    'F' : [],
    'G' : [],
    "M" : [],
}

function graphTraverse(graph){
   let visited = new Set()
   let result = []

  for(let [node, dep] of Object.entries(graph){
      dfs(node)
  }

  function dfs(node){
    if(visited.has(node){
      return
    }
    // pre-order
    //result.push(node)
    for(let dep of graph[node]){
      if(dep){
        dfs(dep)
      }
    }
    // post-order
    result.push(node)
  }
  return result
} 

console.log(graphTraverse(graph))

