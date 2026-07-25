const str="Mom";
let originol=str.toLowerCase();
const reversed=
originol.split("").reverse().join("");
console.log(reversed);
if(originol==reversed){
    console.log("it is a palindrme word---->",  originol ,reversed);
}
else{
    console.log("not a palindrome---->" ,originol ,reversed);
}