import java.util.Scanner;

public class demo {
    public static void main(String[] args){
       System.out.println("printing odd numbers");
       System.out.println(("enter the range N(1 to 50) to print even numbers:"));
       Scanner sc = new Scanner(System.in); 
        int n=sc.nextInt();
        
          for(int i=1;i<=n;i++){
            
                if((i%2!=0)){
                 continue;
                }
            System.out.print(i+" ");
       }
       sc.close();
    }
}

