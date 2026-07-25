#include<stdio.h>
#include<windows.h>
#include<unistd.h>
void sleep_ms(int millisecnds){
    sleep(millisecnds);
}
int main()
{
char *lyrics[]={"hmmm","tum ho mere janatha hu magar"};
printf(lyrics[0]);
sleep_ms(2);
printf(lyrics[1]);
sleep
return 0;
}
