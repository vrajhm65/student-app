function count(arr,target){
    let count=0;
    for(let i=0;i<arr.length;i++){
        if(arr[i]==target){
            count++;

        }
    }
    return count;
}
let a=[1,2,3,2,4,2,5,6,2];
let b=[2,3,3,3,4,5,6,7,6];
console.log(count(a,2));
console.log(count(b,3));                        
