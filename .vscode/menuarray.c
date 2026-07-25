#include<stdio.h>
#include<stdlib.h>
void arrinput(int n, int *arr){
    printf("enter the array elements\n");
    for(int i=0;i<n;i++)
    scanf("%d",&arr[i]);
}
void arrdisplay(int n, int *arr){
    for(int i=0;i<n;i++)
    printf("%d ",arr[i]);
   printf("\n");
}
void linearsearch(int key,int n ,int *arr){
    for (int i = 0; i < n; i++){
        if(arr[i]==key){
        printf(" the key found :%d",i);
        printf("\n");
        return;
        } 
    }
    printf("key not found\n"); 
}
void binarysearch(int key,int low, int high,int *arr){
    while (low<=high){
    int mid=(low+high)/2;
       if(arr[mid]==key){
        printf("key found at index:%d",mid);
        return;
       }
       else if (arr[mid]<key)
       {
        low=mid+1;
       }
       else
       {
       high=mid-1;
       }
    }
    printf("key not found\n");
}

int main()
{
int choice,n,key;
n=0;
int arr[10];

while(1){
printf("---array operation---\n");
printf("1.input\n2.output\n3.linear search\n4.binary search\nselect the options-->\n");
scanf("%d",&choice);

    switch(choice)
    {
    case 1:
    {
    printf("enter the array size\n");
    scanf("%d",&n);
    arrinput(n,arr);
    break;
    }
    case 2:
    { 
        printf("displaying array elements\n");
        arrdisplay(n,arr); 
        break;
    }
    case 3:
    {
      printf("enter the key value:\n");
      scanf("%d",&key);
      linearsearch(key,n,arr);
      break;
    }
    case 4:
    {
        printf("enter the key value:\n");
        scanf("%d",&key);
        binarysearch(key,0,n - 1,arr);
    }
    default: exit(1);   
    }  
}
return 0;
}
