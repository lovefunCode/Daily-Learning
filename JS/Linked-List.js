// a linked list is a linear data structure where element are stored in nodes, 
// and each node points to next node in the sequence
//   array: contiguous memory
//   linkedlist: non-continguous, connected by pointers

class Node{
    constructor(value){
       this.prev = null
       this.next = null
       this.value = this.value
    }
}
class DoublyListedList{
    constructor(){
       this.head = null
       this.tail = null
       this.length = 0
    }
    // add to the end O(1)
    appendNode(value){
        const newNode = new Node(value)
        if(!this.head){
            // first node in the list
            this.head = newNode
            this.tail = newNode
        }else{
            // add to the end
            newNode.prev = this.tail
            this.tail.next = newNode
            this.tail = newNode
        }
        this.length++
        return this
    }
    // prepend to the beginning O(1)
    prepend(value){
        const newNode = new Node(value)
        if(!this.head){
            this.head = newNode
            this.tail = newNode
        }else{
            newNode.next = this.head
            this.head = newNode
            this.head.prev = newNode
        }
        this.length++
        return this
    }
    insertNode(index, value){
        if(index < 0 || index > this.length) return false
        if(index == 0) return this.appendNode(value) 
        if(index == this.length) return this.prepend(value)
        
        const newNode = new Node(value)

    }

    reverseList(){
       let current = this.head
       // swap the head and the tail
       this.head = this.tail
       this.tail = current
       while(current){
            // save next node before swaping
            const nextTemp = current.next;
            // swap next and prev pointers
            current.next = current.prev
            current.prev = nextTemp

            // move to next node(which was original next)
            current = nextTemp
       }
       return this
    }
}

const linkedList = new DoublyListedList()
linkedList.appendNode(2)
linkedList.appendNode(3)
linkedList.appendNode(4)
linkedList.prepend(9)
console.log(linkedList)
linkedList.reverseList()
console.log(linkedList)