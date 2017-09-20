// JavaScript source code
/* 传入参数

   myScroll({
          el:父级
          type: 运动类型
          scollOff：是否显示滚动条
})

*/
function myScroll(init) {
            if (!init.el) {
                return;
            }
            var wrap = init.el;
            var inner = init.el.children[0];
              
      
            var myScroll = document.createElement("div");
            var startY = 0;
            var newY = 0;
            var startPoint=0;
            var lastY = 0;
            var lastDis = 0;
            var lastTime = 0;
            var timeDis = 0;
            var maxHeight = 0;
            if (init.scrollOff) {
                myScroll.style.cssText = "width:5px;position:absolute;background:rgba(0,0,0,0.5);right:0;top:0;border-radius:5px;opacity:0;transition:1s opacity;";
                wrap.appendChild(myScroll);
                inner.style.minHeight = "100%";
                var scale = wrap.clientHeight / inner.offsetHeight;
            }
            

            css(inner, "translateZ", 0.01);
            inner.addEventListener("touchstart", function (e) {
                maxHeight = wrap.clientHeight - inner.offsetHeight;

                  scale = wrap.clientHeight / inner.offsetHeight;
                if (init.scrollOff) {          //是否显示滚动条
                    if (maxHeight >= 0) {
                        myScroll.style.display = "none"
                    } else {
                        myScroll.style.display = "block";
                        myScroll.style.opacity = 1;
                    }

                    myScroll.style.height = scale * wrap.clientHeight + 'px';
                }
               
                 
                lastTime = new Date().getTime();
                clearInterval(inner.timer);
                startPoint=e.changedTouches[0].pageY;
                startY = css(inner, "translateY");
                lastY = startY;                             
                lastDis = timeDis = 0;
                init.start&&init.start.call(wrap,e)                  
            })
            inner.addEventListener("touchmove", function (e) {
                var nowTime = new Date().getTime();
                var nowPoint = e.changedTouches[0].pageY;
                var movePintDis = nowPoint - startPoint;
                var translateY = startY + movePintDis;
                if (css(inner, "translateY") > 20) {
                    css(inner, "translateY",20);
                }
                css(inner, "translateY", translateY);
                init.scrollOff ? css(myScroll, "translateY", -translateY * scale):" ";
                lastDis = translateY - lastY;                  
                lastY = translateY;                           
                timeDis = nowTime - lastTime;                   
                lastTime = nowTime;
                init.move&&init.move.call(wrap,e);                           
            })
            inner.addEventListener("touchend", function (e) {
                var type =init.type;
                var speed = Math.round(lastDis / timeDis * 10);
                speed = timeDis <= 0 ? 0 : speed;                                
                var target = Math.round(speed * 30 + css(inner, "translateY"));

                if (target > 0) {                                            
                    target = 0;
                    type: "backOut";
                } else if (target < maxHeight) {
                    target = maxHeight;
                    type: "backOut";
                   
                }
                MTween({
                    el: inner,
                    time: Math.round(Math.abs(target - css(inner, "translateY")) * 2),
                    target: {translateY:target},
                    type: type,

                    callBack: function () { init.scrollOff ? (myScroll.style.opacity = 0):" "; },

                    callIn: function () {
                        var translateY = css(inner, "translateY")
                        init.scrollOff ? css(myScroll, "translateY", -translateY * scale) : "";
                       init.move&&init.move.call(wrap,e);
                 }
                })
                init.end&&init.end.call(wrap,e)
            })
}