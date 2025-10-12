function binarySearch(hash){
    let left = 0, right = this.sortedHashes.length - 1
    while(left < right){
        const mid = left + Math.floor((right - left)/2)
        if(this.sortedHashes[mid] < hash){
            left = mid + 1
        }else{
            right = mid
        }
    }
    return left
}

// consistent hashing: distributed cache
//  1. Minimal Redistribution
//  2. Scalability
//  3. Load Balancing
//  4. Fault Tolerance
