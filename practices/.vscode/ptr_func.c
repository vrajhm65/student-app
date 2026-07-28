#include<stdio.h>
void SwapWithaddress (int *n1,int *n2)
{
    int temp;
    temp=*n1;
    *n1=*n2;
    *n2=temp;

}
void Swapwithoutaddress (int n1,int n2)
{
     int temp;
     temp=n1;
     n1=n2;
     n2=temp;

}
int main()
{
     int num1=10 , num2=20;
     Swapwithoutaddress(num1,num2);
     printf("after swap without address\n");
     printf("num1=%d\n",num1);
     printf("num2=%d\n",num2);

     SwapWithaddress(&num1,&num2);
     printf("after swap with address\n");
     printf("num1=%d\n",num1);
     printf("num2=%d\n",num2);

     return 0;
}
