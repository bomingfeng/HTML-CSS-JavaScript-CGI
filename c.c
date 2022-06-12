#include <sys/types.h>
#include <sys/socket.h>
#include <linux/in.h>
#include <linux/un.h>
#include <string.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/select.h>
#include <sys/time.h>
//#include "addr.h"
#define DIbase 0x7000
#define db_max 1000
#define port 1000   
int socket_fd;
char modbus_buf[256];

float host_to_client(short in,short gene)
{
float out;
float muti;
muti=32768/gene;
out=in/muti;
return out;
}

short client_to_host(float in,short gene)
{short out;
float muti;
muti=32768/gene;
out=in*muti;
return out;
}

int modbus_tcp_transfer(char *buf)
{int nwrite, nreads, ret;
char sendbuf[12];
struct sockaddr_in server_addr;
fd_set readfd;
struct timeval timeout;
sendbuf[0]=0;
sendbuf[1]=0;
sendbuf[2]=0;
sendbuf[3]=0;
sendbuf[4]=0;
sendbuf[5]=6;
sendbuf[6]=buf[0];
sendbuf[7]=buf[1];
sendbuf[8]=buf[2];
sendbuf[9]=buf[3];
sendbuf[10]=buf[4];
sendbuf[11]=buf[5];


if((socket_fd=socket(AF_INET,SOCK_STREAM,0))==-1){
close(socket_fd);
return -1;}
bzero(&server_addr, sizeof(server_addr));
server_addr.sin_family=AF_INET;
server_addr.sin_port=htons(port);
server_addr.sin_addr.s_addr=inet_addr("127.0.0.1");
if(connect(socket_fd,(struct sockaddr *)(&server_addr),sizeof(struct sockaddr))==-1)
{close(socket_fd);
return -1;}
timeout.tv_sec=1;
timeout.tv_usec=0;
FD_ZERO(&readfd);
FD_SET(socket_fd,&readfd);
if((nwrite=write(socket_fd,sendbuf,12))==-1){
close(socket_fd);
return -1;}
ret=select(socket_fd+1,&readfd,NULL,NULL,&timeout);
switch(ret){
case -1:
close(socket_fd);
return -1;
break;
case 0:
close(socket_fd);
return -1;
break;
default:
if(FD_ISSET(socket_fd,&readfd)){
if((nreads=read(socket_fd,buf,256))==-1){
close(socket_fd);
return -1;}
close(socket_fd);
return 0;}
break;
}
}

void create_modbus(char a1,char a2,char a3,char a4,char a5,char a6)
{modbus_buf[0]=a1;
modbus_buf[1]=a2;
modbus_buf[2]=a3;
modbus_buf[3]=a4;
modbus_buf[4]=a5;
modbus_buf[5]=a6;}

int main(int argc,char *argv[])
{
  int ret=0;
  unsigned char signed2char[2];
  int i,k;
   unsigned short DI[4];


  char str1[5];
 create_modbus(1,4,DIbase>>8,DIbase&0xff,0,4);    
  if((ret=modbus_tcp_transfer(modbus_buf))==-1)     
   exit(EXIT_FAILURE);
  k=0;

  for(i=0;i<4;i++)
  {
    signed2char[1]=modbus_buf[k+9]; //9
    signed2char[0]=modbus_buf[k+10];  //10

    DI[i]=*((short *)signed2char);    //save
    k=k+2;
  }

         printf("Content-Type:text/html\n\n");
        printf("%u|%u|%u|%u", DI[0],DI[1],DI[2],DI[3]);
         return 0;

}





















