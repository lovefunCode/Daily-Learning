class Mypromise{
    constructor(executor){
        this.state = "pending"
        this.value = undefined
        this.reason = undefined
        this.resolveCbs = []
        this.rejectCbs = []

        const resolve = (value)=>{
            if(this.state == 'pending'){
                this.state = 'resolved'
                this.value = value
                this.resolveCbs.forEach(cb => cb(value))
            }
        }

        const reject = (reason) =>{
            if(this.state == 'pending'){
                this.state = 'rejected'
                this.reason = reason
                this.rejectCbs.forEach(cb=>cb(reason)) 
            }
        }

        try{
            executor(resolve, reject)
        }catch(err){
            reject(err)
        }
    }

    then(onFulfilled, onRejected){
        return new Mypromise((resolve, reject)=>{
            const handleResolved = ()=>{
               try{
                 if(typeof onFulfilled == 'function'){
                    const res = onFulfilled(this.value)
                    resolve(res)
                    }else{
                        resolve(this.value)
                    }
               }catch(err){
                    reject(err)
               }
            }

            const handleRejected = ()=>{
               try{
                 if(typeof onRejected == 'function'){
                    const res = onRejected(this.reason)
                    resolve(res)
                    }else{
                        reject(this.reason)
                    }
               }catch(err){
                    reject(err)
               }
            }

            if(this.state == 'resolved'){
                setTimeout(handleResolved, 0)
            }else if(this.state == 'rejected'){
                setTimeout(handleRejected, 0)
            }else{
                this.resolveCbs.push(()=>setTimeout(handleResolved, 0))
                this.rejectCbs.push(()=>setTimeout(handleRejected, 0))
            }
        })
    }
    
    catch(onRejected){
        return this.then(null, onRejected)
    }
}

const promise1 = new Mypromise((resolve)=>{
    setTimeout(()=>{
        console.log('success 1')
        resolve('resolved value')
    }, 0)
})

promise1.then((res)=>{
    console.log(res)
})

const promise2 = new Mypromise((resolve, reject)=>{
    reject('I am the reject')
})
promise2.then((res)=>{
    console.log('res===', res)
}).catch((err)=>{
    console.log('err-----', err)
})

// test2 chaining
const promise3 = new Mypromise((resolve)=>{
    setTimeout(()=>resolve(5), 10)
})
promise3.then(val=>{
    console.log('first start --', val)
    return val * 2
}).then(val=>{
    console.log('second then --', val)
   return val + 10
}).then(val=>{
   console.log('third then --', val)
})
