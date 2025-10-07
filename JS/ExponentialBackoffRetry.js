async function exponentialBackoffForRetries(url, retries = 5, delay = 500){
   for(let attempt = 0; attempt < retries; attempt++){
        try{
            const res = await fetch(url)
            if(!res.ok){
                throw new Error(`HTTP Error: ${res.status}`)
            }
            return await res.json()
        }catch(err){
            if(attempt === retries - 1){
                throw err
            }
            // calculate exponential backoff 500ms, 1s, 2s, 4s, 8s
            const backoff = delay * Math.pow(2, attempt)
            // Add jitter(randomness) between 50% and 100% of backoff
            // This prevent all clients from retrying at the exact same time
            const jitter = backoff * (0.5 +  Math.random() * 0.5)
            // Wait before retrying
            await new Promise((resolve)=>{
                setTimeout(resolve, jitter)
            })
        }
   }
}