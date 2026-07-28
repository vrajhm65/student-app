 
 function move_zero(arr){
    let res=[];
    let zero=0;
    for(i=0;i<arr.length;i++){
       let n=arr.length;
        if(n==0){
        zero++;
        }
        else{   
        res.push(n);
        }
    }
    while(zero>0){
        res.push(n);
        zero--;
    }
    return res;
 }

 let numbers=[1,2,0,3,0];
 console.log(move_zero(numbers));