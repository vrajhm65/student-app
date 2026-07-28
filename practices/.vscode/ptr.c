#include<stdio.h>
int main(){
int c=50;
int *b=&c;
int **a=&b;
printf(" value at A is %d ",**a);

}