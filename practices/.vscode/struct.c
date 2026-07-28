#include<stdio.h>
#include<string.h>
struct emp
{
    char name[10];
    int id;
    float salary;
};
int main()

{
struct emp e1;
printf("enter the employee details\n");
printf("enter the name:\n");
scanf("%s",e1.name);
printf("enter the id \n");
scanf("%d",&e1.id);
printf("enter the salary\n");
scanf("%f",&e1.salary);
printf("\n");

printf("the details are following \n");
printf("name:%s\n",e1.name);
printf("id:%d\n",e1.id);
printf("name:%.2f\n",e1.salary);
return 0;
}