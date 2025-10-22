class Mypromise{
    constructor(){
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
            execute(resolve, reject)
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
                        resolve(this.value)
                    }
               }catch(err){
                    reject(err)
               }
            }

            if(this.state == 'resolved'){
                setTimeout(()=>handleResolved, 0)
            }else if(this.state == 'rejected'){
                setTimeout(()=> handleRejected, 0)
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