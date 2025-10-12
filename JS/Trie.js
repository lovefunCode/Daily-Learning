class TrieNode{
    constructor(){
        this.children = {}
        this.isEndOfNode = false
        this.frequency = 0
    }
}

class Trie{
    constructor(){
        this.root = new TrieNode()
    }
    insert(word){
        if(typeof word != 'string' || word.length === 0){
            return;
        }
        let node = this.root
        let lowerWord = word.trim().toLowerCase()
        for(const char of lowerWord){
            if(!node.children[char]){
                node.children[char] = new TrieNode()
            }
            node = node.children[char]
        }
        node.isEndOfNode = true
        node.frequency += 1
    }
    search(word){
        let node = this.root
        let lowerword = word.trim().toLowerCase()
        for(const char of lowerword){
            if(!node.children[char]){
                return false
            }
            node = node.children[char]
        }
        return node.isEndOfNode ? node.frequency : 0
    }
}

const trie = new Trie()
trie.insert('Apple')
trie.insert('App')
trie.insert('Appl')
trie.insert('Apple')

console.log(trie.search('App'));    // 1
console.log(trie.search('Apple'));  // 2
console.log(trie.search('Appl'));   // 1
console.log(trie.search('Banana')); // 0