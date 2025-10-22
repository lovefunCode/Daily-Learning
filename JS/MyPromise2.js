class MyPromise{
    constructor(executor){
        this.state = 'pending'
        this.value = undefined
        this.reason = undefined
        this.resolvedCbs = []
        this.rejectedCbs = []
        
        const resolve = (value)=>{
            if(this.state === 'pending'){
                this.state = 'resolved'
                this.value = value
                this.resolvedCbs.forEach(cb=>cb(value))
            }
        }

        const reject = (reason)=>{
            if(this.state === 'pending'){
                this.state = 'rejected'
                this.reason = reason
                this.rejectedCbs.forEach(cb=>cb(reason))
            }
        }
    
        try{
            executor(resolve, reject) 
        }catch(error){
            reject(error)
        }
    }

    then(onResolved, onRejected){
        // capture parenet promise's state and values
        const parent = this;
        return new MyPromise((resolve, reject)=>{
            const handleResolved = ()=>{
                try{
                    if(typeof onResolved == 'function'){
                        const res = onResolved(parent.value)
                        if(res instanceof MyPromise){
                            res.then(resolve, reject)
                        }else{
                            resolve(res)
                        }
                    }else{
                        resolve(parent.value)
                    }
                }catch(err){
                    reject(err)
                }
            }

            const handleRejected = ()=>{
                try{
                    if(typeof onRejected == 'function'){
                        const res = onRejected(parent.reason)
                        if(res instanceof MyPromise){
                            res.then(resolve, reject)
                        }else{
                            resolve(res)
                        }
                    }else{
                        reject(parent.reason)
                    }
                }catch(err){
                    reject(err)
                }
            }

            if(parent.state === 'resolved'){
                setTimeout(handleResolved, 0)
            }else if(parent.state == 'rejected'){
                 setTimeout(handleRejected, 0)
            }else{
                // store callbacks that will be executed when promise settles
                parent.resolvedCbs.push(()=>{
                    setTimeout(handleResolved, 0)
                })
                parent.rejectedCbs.push(()=>{
                    setTimeout(handleRejected, 0)
                })
            }
        })
    }

    catch(rejected){
        return this.then(null, rejected)
    }
}

const myPromise1 = new MyPromise((resolve)=>{
    resolve(5)
})
myPromise1.then(val =>{
    console.log('first val is', val)
    return val * 2
}).then(val=>{
    console.log('second val is', val)
    return val + 10
}).then(val=>{
     console.log('third val is', val)
})

const myPromise2 = new MyPromise((resolve, reject)=>{
    reject('get the wrong mess')
})

myPromise2.then((res)=>{
    console.log('res--', res)
}).catch((err)=>{
     console.log('err--', err)
    return err
}).then((res)=>{
    console.log('res2--', res)
}).catch((err)=>{
    console.log('err2--', err)
    return err+'2'
}).then((res)=>{
    console.log('res3--', res)
}).catch((err)=>{
     console.log('err3--', err)
})


Promise.reject('get the wrong mess')
  .then(res => console.log('res--', res))
  .catch(err => {
    console.log('err--', err)
    return err
  })
  .then(res => console.log('res2--', res))
  .catch(err => {
    console.log('err2--', err)
    return err + '2'
  })
  .then(res => console.log('res3--', res))
  .catch(err => console.log('err3--', err))
