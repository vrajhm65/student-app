function  linearsearch(arr,target){
    for ( let i = 0; i < arr.length; i++){
        if(arr[i]===target)
            return i;   
    }
       return -1; 
}
let arr=[5,1,2,4,3];
let target=4;
console.log(linearsearch(arr,target));