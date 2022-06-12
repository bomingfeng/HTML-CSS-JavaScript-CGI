
/*
*创建异步访问对象
*/

function createXHR()
{
 var xhr;
try
{
    xhr = new ActiveXObject("Msxm12.XMLHTTP");
}
catch (e)
{
    try
    {/*code for IE5、IE6*/
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e)
    {
        xhr = false;
    }
}

if(!xhr && typeof XMLHttpRequest != 'undefined')
    {
      xhr = new XMLHttpRequest();
    }

    return xhr;

}

/*
 *异步访问提交处理,4路DO
 */
 function DIO_load()
 {
  DI_load();
  DO_load();
 }

function DI_load() 
{
    xhr_DI = createXHR();
    if(xhr_DI)


    {    
        var get_str_DI="cur_time=";    
        get_str_DI = get_str_DI + new Date().getTime();
        xhr_DI.open("GET", "/test/cgi-bin/DI.cgi?" + get_str_DI);
        xhr_DI.send(null);
        xhr_DI.onreadystatechange = callbackFunction_DI;
    }

else

{

alert("浏览器不支持，请更换浏览器！");

}

}
/*
异步回调函数处理！
*/
function callbackFunction_DI()
{
if(xhr_DI.readyState == 4)
    {
      if(xhr_DI.status==200)
        { 
         var returnValue = xhr_DI.responseText;

         if(returnValue !=null && returnValue.length > 0)
            {
                 var response = xhr_DI.responseText.split("|");
                document.getElementById("DI0").value = response[0];
                document.getElementById("DI1").value = response[1];
                document.getElementById("DI2").value = response[2];
                document.getElementById("DI3").value = response[3];
            }
         else
             {
               alert("结果为空！");
             }
        }
        else{

           alert("界面出现异常！")
        }
    }
}


function DO_load() 
{ 

    xhr_read = createXHR();
    if(xhr_read)

    {     
        var  check_str1;
        check_str1 = check_str1 +"&cur_time";
        check_str1 = check_str1 + new Date().getTime();
        xhr_read.open("GET", "/test/cgi-bin/DO_read.cgi?" + check_str1);
        xhr_read.send(null);
        xhr_read.onreadystatechange = callbackFunction_read;
    }
    else
    {
        alert("浏览器不支持，请更换浏览器！");
    }
}

/*
 *异步回调函数处理
 */
function callbackFunction_read()
{
    if (xhr_read.readyState == 4)
    {
        if (xhr_read.status == 200)
        {                

            var returnValue = xhr_read.responseText;
            if(returnValue != null && returnValue.length > 0)
            {      
                var response = xhr_read.responseText.split("|");

             document.getElementById("state1").value = response[0];
             document.getElementById("state2").value = response[1];
             document.getElementById("state3").value = response[2];
             document.getElementById("state4").value = response[3];

              setTimeout("DIO_load()",2000);
            }
            else
            {
             alert("访问数据为空！");
            }
        }
        else
        {
         alert("页面数据交互异常！");
        }
    }
}


/*
 *异步访问提交处理,4路DO
 */

function DO_set(flag1,flag2) 
{ 

    xhr_1 = createXHR();
    if(xhr_1)

    {     
            var check_str=flag1;
            check_str=check_str+"&"+flag2;
            check_str = check_str +"&cur_time";
            check_str = check_str + new Date().getTime();
            xhr_1.open("GET", "/test/cgi-bin/DO.cgi?" + check_str);
            xhr_1.send(null);
            xhr_1.onreadystatechange = callbackFunction_1;
    }
    else
    {
        alert("浏览器不支持，请更换浏览器！");
    }
}

/*
 *异步回调函数处理
 */
function callbackFunction_1()
{
    if (xhr_1.readyState == 4)
    {
        if (xhr_1.status == 200)
        {                

            var returnValue = xhr_1.responseText;
            if(returnValue != null && returnValue.length > 0)
            {             
                var response = xhr_1.responseText.split("|");
                //  alert("111");  
                if(response[0]=='1')
                 document.getElementById("state1").value = response[1];  
                else if(response[0]=='2')
                 document.getElementById("state2").value = response[1];
                else if (response[0]=='3')
                 document.getElementById("state3").value = response[1];
                else if(response[0]=='4')
                 document.getElementById("state4").value = response[1];
                 //alert("111");
                                //setTimeout("DI_load()",1000);
              setTimeout("callbackFunction_1()",2000);
                            //document.getElementById("flag1").value = returnValue;
            }
            else
            {
             alert("访问数据为空！");
            }
        }
        else
        {
         alert("页面数据交互异常！");
        }
    }
}

