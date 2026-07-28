function vc(str){
    let v=0;
    let c=0;
    originol=str.toLowerCase();
    for(let ch of originol){
        if (ch=='a'|| ch=='e'|| ch=='i'|| ch=='o'|| ch=='u')
            {
            v++;
        }
        else{
            c++;
        }
    }
     return {c,v};
}
let str="fHhaaaaa";
console.log(vc(str));
