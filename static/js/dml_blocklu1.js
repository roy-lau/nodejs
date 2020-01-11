window.onload = function(){
    var clickbox = this.document.getElementsByClassName('allclickbox')
    boxcurrencybindclick(clickbox)
}

function boxcurrencybindclick(a){
    for(var i=0;i<a.length;i++){
        a[i].onclick=boxcurrencyClick(a[i].class,a[i].id)
    }
}
function boxcurrencyClick(a,b){
    var s = document.getElementsByClassName(a)
    for(var i=0;i<s.length;i++){
        if(b.id!=s[i]){
            s[i].style.display='none'
        }
        s[i].style.display='block'
    }
}