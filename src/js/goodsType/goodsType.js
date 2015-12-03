/**
 * Created by OurEDA on 15/12/3.
 */
function show(index){
    if(index=='Category 1'){
        document.getElementById("firsthidden").style.display="none";
    }else if(index=='Category 2'){
        document.getElementById("firsthidden").style.display="block";
    }else{
        document.getElementById("firsthidden").style.display="none";
    }
}