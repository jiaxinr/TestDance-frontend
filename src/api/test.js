function test(){
    let s="abcdefgggfedcbc";
    let n=s.length;
    let numtmp=0;
    let flag=false;
    for(let i=0;i<n;i++){
        if(s[i]===s[i+1]&&(!flag)){
            flag=true;
            s=s.split(s.slice(i,i+1)).join("");//删除重复字符
            n=n-2;
            numtmp=i;
            console.log("第一次位置："+s);
        }
    }
    let i=numtmp-1;
    let j=numtmp;

    while(true){

        if(s[i]===s[j]){
            console.log("删除字符位置："+s);
            s=s.split(s.slice(i,i+1)).join("");
            n=n-2;
            i--;
            j--;
        }else{
            i++;
            j++;
            console.log(i+"  "+j);
        }
        if(j===n-1) break;
    }
    console.log("结果："+s);

}
test();