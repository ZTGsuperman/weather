// JavaScript source code

        
window.onload = function () {
    var wrap = document.getElementById('wrap');
    var move = wrap.querySelector('.move');
    var page = move.querySelectorAll('.page')

    var pageL = page.length
    var pageW = page[0].offsetWidth;

    css(move, "width", pageL * pageW);
    for (var i = 0; i < pageL; i++) {
        page[i].style.left = i * pageW + 'px';
    }


    mv.tool.preload(loading,loadend)
        function loading(total,now) {
            var prog = document.querySelector('.prog');
            var clip = prog.querySelector('.clip');
            var num = prog.querySelector('.num');
            var pW=prog.offsetWidth;
            var cH=clip.offsetHeight
            var scale = now / total;

            clip.style.clip = 'rect(0px,' + (scale * pW) + 'px ,' + cH + 'px,0px)';
            num.innerHTML = Math.round(scale * 100) + '%';
        }
        function loadend() {
            var load = document.querySelector('.load');
            var move = document.querySelector('.move');
            load.style.display = 'none';
            
            move.style.transition = move.style.webkitTransition = '1.2s'
            css(move, 'translateZ', 0);
            css(move, 'opacity', 100);
            mv.app.pageOne();
        }

}
  

var mv = {};
mv.app = {}
mv.tool={ }

//图片预加载
mv.tool.preload = function (loading,loadend) {
    var imgs = [
        "images/bg/sun_bg.png",
        "images/bg/clod_bg.png",
        'images/bg/thunder.png',
        'images/bg/rain_bg.png',
        'images/bg/sun_bg.png',
        'images/weather/sunshine.png',
        'images/weather/cloud.png',
        'images/weather/shade.png',
        'images/weather/shower.png',
        'images/weather/thu_rain.png',
        'images/weather/s_rain.png',
        'images/weather/m_rain.png',
        'images/weather/b_rain.png',
        'images/weather/h_rain.png',
        'images/weather/most_rain.png',
    ];

    var num = 0;
    load()
    function load() {
        var imgObj = new Image()
        imgObj.src = imgs[num];
        imgObj.onload = function () {
            if (num > imgs.length-1) {
                loadend && loadend();
            } else {
                load();
                loading && loading(imgs.length, num+1);
            }
            num++;
        }
    }
}

mv.app.pageOne=function(){

    /*第一页*/
    var pageOne = document.querySelector(".pageOne");
    var oneInner = pageOne.querySelector(".one_inner");
    var oneAdd = pageOne.querySelector("#oneBtn");
    var hour = pageOne.querySelector('.hourly_inner')
    var move = document.getElementById('wrap').querySelector('.move');


    //滑动屏幕
    mv.tool.myScroll({
        el: pageOne,
        dir:'y',
    })

    //移动时刻
   mv.tool.myScroll({
        el: hour,
        dir: 'x',
       end: function () {
            var swiper = hour.children[0];
            if (swiper.offsetWidth < hour.offsetWidth) {
                var x = css(swiper, 'translateX');
                if (x < 0||x>0) {
                    x = 0;
                    css(swiper, 'translateX', x);
                    return;
                } 
            }
        }
    })
   
   oneAdd.addEventListener("touchstart", function () {
       move.style.transition = move.style.webkitTransition = '0.2s'
       mv.app.changeX(1)
       mv.app.pageTwo()
    })

    //一进来给一个默认的地点
    ajax('post', 'https://free-api.heweather.com/v5/weather?city=beijing&key=4296492e2f4d41e18ebb6a02b5ec110a', '', function (date) {
        var date = JSON.parse(date);
        mv.app.addData(date.HeWeather5[0]);

        var bgSrc = mv.app.changeIco(date.HeWeather5[0].now.cond.txt)
         mv.app.changeBg(bgSrc.bg)
    })
}

mv.app.pageTwo = function () {
    var pageTwo = document.querySelector('.pageTwo');
    var twoAdd = pageTwo.querySelector('#twoBtn');
    var goBack = pageTwo.querySelector('#goBack');

    var searched = pageTwo.querySelector('.searched');
    var pLi = searched.getElementsByTagName('li');

    twoAdd.addEventListener("touchstart", function () {
        mv.app.changeX(2)
        mv.app.pageThree()
    })
    goBack.addEventListener("touchstart", function () {
        mv.app.changeX(0)
    })


    //定位
    var pBtn = pageTwo.querySelector('.position_btn');
    var moveDot = pBtn.querySelector('.dot');
    var open = pBtn.querySelector('.open');
    var close = pBtn.querySelector('.close');

    var isOpen = false;
    var btnW = pBtn.offsetWidth;
    var left = css(moveDot, 'left');
    var hPosition = false;
   pBtn.addEventListener('touchstart', function () {
       //单击切换按钮
      
           if (!isOpen) {
                    mv.app.getPosition();   //定位
                   moveDot.style.left = (btnW - moveDot.offsetWidth) - left + 'px';
                   open.style.left = 0 + 'px';
                   close.style.left = close.offsetWidth + 'px';
                   isOpen = true;
                   hPosition = true;
              
         
           } else {
              moveDot.style.left = left + 'px';
              open.style.left = -open.offsetWidth + 'px';
              close.style.left = 0 + 'px';
              isOpen = false;
              //移除定位的li
              if (hPosition) {                          //已定位了的才删除
                  searched.removeChild(pLi[0]);
                  hPosition = false;
              }
           }
       
    })
    

    //事件委托,单击搜索过的天气li切换天气,长按删除搜索过的列表li
    var shade = pageTwo.querySelector('.shade');
    var oDelete = pageTwo.querySelector('.delete');
    var deBtn = oDelete.querySelector('.delete_btn');
    var isDelete = false;
    
    var timer = null;
    searched.addEventListener('touchstart', function (ev) {
        var target = ev.srcElement || ev.target;

        var li = searched.children;
        for (var i = 0; i < li.length; i++) {
            li[i].index = i;
        }
        var num = 0;
        if (target.nodeName.toLowerCase() === 'li') {
            timer = setInterval(function () {
                num+=100;
                if (num > 1000) {
                    clearInterval(timer);
                    isDelete = true;
                    oDelete.style.bottom = 0;
                    shade.style.display = 'block';
                } else {
                    isDelete = false;
                }
            }, 100)
        } else {
            return;
        }
        
    })
    searched.addEventListener('touchmove', function (ev) {
            clearInterval(timer)
          })
        
      searched.addEventListener('touchend', function (ev) {
          var ev = ev || window.event;
          clearInterval(timer)
        var target = ev.srcElement || ev.target;
        if (target.nodeName.toLowerCase() === 'li' && (!isDelete)) {
            var text = target.getElementsByTagName('p')[0].getElementsByTagName('h4')[0].innerHTML;
            ajax('post', 'https://free-api.heweather.com/v5/weather?city=' + text + '&key=4296492e2f4d41e18ebb6a02b5ec110a', '', function (date) {
                var date = JSON.parse(date);

                mv.app.removeChild();
                mv.app.addData(date.HeWeather5[0])
                mv.app.changeX(0)
            })
        } else {
            daleteFn(target.index)
          }
        })

      function daleteFn(target) {
          var li = searched.children;
          shade.addEventListener('touchend', function () {
              oDelete.style.bottom = -oDelete.offsetHeight+'px';
              shade.style.display = 'none';
          })
          deBtn.addEventListener('touchend', function () {
              searched.removeChild(li[target]);
              oDelete.style.bottom = -oDelete.offsetHeight + 'px';
              shade.style.display = 'none';

          })
      }

}

var isInput = true;
mv.app.pageThree = function () {
    var pageThree = document.querySelector('.pageThree');
    var search = pageThree.querySelector('#search');
    var exist = pageThree.querySelector('.isExist');
    var hotCity = pageThree.querySelector('.hot_city');
    var clearTxt = pageThree.querySelector('.clearTxt');
    var cancel = pageThree.querySelector('.cancel');

    var arr = search.value;
    var isFrist = false;
   

    addEvent(search, 'touchstart', function (ev) {
        search.focus();                          //在移动端下的focus事件有问题，需要用触发另一个事件来回调
        if (!isFrist) {
            search.value = "";
            isFrist = true;
        }
        isInput=true
        ev.stopPropagation()
    })

    addEvent(document, 'touchstart', function () {
        search.blur();
        if (search.value == "") {
            search.value = arr;
            isFrist = false;
        }
    })
    //单击“取消”返回上一页（第二页）
    cancel.addEventListener('touchstart', function () {
        mv.app.changeX(1)
    })
      
    //在边输入，边请求判断
    search.addEventListener('input', function () {
        var lis = exist.children;
        if (lis.length) {
            for (var i = 0; i < lis.length; i++) {
                exist.removeChild(lis[i])
            }
        }

        //获取数据
            ajax('post', 'https://free-api.heweather.com/v5/weather?city=' + search.value + '&key=4296492e2f4d41e18ebb6a02b5ec110a', '', function (date) {
                var date = JSON.parse(date)
               
                var status = date.HeWeather5[0].status;            //如果请求成功

                if ((status === 'ok')&&isInput) {
                    for (var i = 0; i < date.HeWeather5.length ; i++) {
                        var oLi = document.createElement('li');
                        oLi.innerText = date.HeWeather5[i].basic.city
                        exist.appendChild(oLi);
                        exist.style.display = 'block';
                        hotCity.style.display = "none";
                    }
                    search.blur();
                    isInput = false;
                }
               
                lis = exist.children;
                //单击li添加天气
                if (lis.length) {
                    for (var y = 0; y < lis.length; y++) {
                        lis[y].index = y;
                        lis[y].addEventListener('touchstart', function () {
                            mv.app.changeX(0)
                            exist.style.display = 'none';
                            hotCity.style.display = "block";
                            search.value = '';

                            mv.app.removeChild();
                            mv.app.addData(date.HeWeather5[this.index]);
                            //添加到第二页页的搜索记录
                            mv.app.pageTwoLi(this.innerHTML, false);

                            //获取背景图片链接
                            var bgSrc = mv.app.changeIco(date.HeWeather5[this.index].now.cond.txt)
                            mv.app.changeBg(bgSrc.bg)

                        })
                        isInput
                    }
                }
            })
        clearTxt.style.display = 'block';
    })

    //清除搜索框的文字
    addEvent(clearTxt, "touchstart", function () {
        search.value = "";
        clearTxt.style.display="none"
    })


    //热门城市，单击添加第二页的li
    var cityList = pageThree.querySelector('.city_list').getElementsByTagName('a');
    for (var i = 0; i < cityList.length; i++) {
        cityList[i].addEventListener('touchstart', function () {
            mv.app.pageTwoLi(this.innerHTML,false);
            mv.app.changeX(1);
        })
    }

}

mv.app.addData = function (date) {
    var pageOne = document.querySelector(".pageOne");
    var nowCity = pageOne.querySelector('.nowCity')
    var nowTem = pageOne.querySelector('.now_tem')
    var state = pageOne.querySelector('.state')
    var range = pageOne.querySelector('.range_tem')
    var hearderIco = pageOne.querySelector('.nowW_ico')
  

    nowCity.innerHTML = date.basic.city;
    nowTem.innerHTML = date.now.tmp
    state.innerHTML = date.now.cond.txt
    range.innerHTML = date.daily_forecast[0].tmp.min + '-' + date.daily_forecast[0].tmp.max
    hearderIco.src = mv.app.changeIco(date.now.cond.txt).src
    //获取每小时的预报
    hourly()
    function hourly() {
        var hourly = pageOne.querySelector('.hourly');
        var today = hourly.querySelector('.title').querySelector('.today')
        var timeTem = hourly.getElementsByTagName('ol')[0]

        today.innerHTML = getday(date.basic.update.loc)   //获取当前是星期几

        for (var i = 0; i < date.hourly_forecast.length; i++) {
            //添加时刻数据
            var li = document.createElement('li');
            //添加时间
            var hour = date.hourly_forecast[i].date.split(' ')
            var h4 = document.createElement('h4');
            h4.innerHTML = hour[1];
            li.appendChild(h4);

            var img = document.createElement('img');
            var em = document.createElement('em');
            img.src = mv.app.changeIco(date.hourly_forecast[i].cond.txt).src;
            em.innerHTML = date.hourly_forecast[i].tmp;
            li.appendChild(img);
            li.appendChild(em);
            timeTem.appendChild(li);
        }

        //对每时刻温度
        if (date.hourly_forecast.length) {
            var ol = hourly.getElementsByTagName('ol')[0];
            var oLi = ol.getElementsByTagName('li');

            var iLength = oLi.length;
            var liW = oLi[0].offsetWidth;
            ol.style.width = iLength * liW + 'px';
            for (var i = 0; i < iLength; i++) {
                oLi[i].style.left = i * liW + 'px';
            }
        }
        
    }
    

    function getday(arr) {
        var dateArr = arr.split(' ');
        var myDate = new Date(dateArr[0])
        var week = ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        return week[myDate.getDay()]
    }


    //获取后面几天的天气
    days()
    function days() {
        var days = pageOne.querySelector('.daily');
        var dayDate = days.getElementsByTagName('ol')[0];

        for (var j = 0; j < date.daily_forecast.length; j++) {

            var li = document.createElement('li');

            var span = document.createElement('span');
            addClass(span, 'week')
            span.innerHTML = getday(date.daily_forecast[j].date)
            li.appendChild(span)

            var div = document.createElement('div');
            addClass(div, "ico_tem")
            addClass(div, "clear")

            var img = document.createElement('img');
            img.src = mv.app.changeIco(date.daily_forecast[j].cond.txt_d).src

            var p = document.createElement('p');
            addClass(p, "max_min")

            var em1 = document.createElement('em');
            var em2 = document.createElement('em');
            em1.innerHTML = date.daily_forecast[j].tmp.max;
            em2.innerHTML = date.daily_forecast[j].tmp.min;

            var h4 = document.createElement('h4');
            h4.innerHTML = date.daily_forecast[j].cond.txt_d;

            p.appendChild(em1)
            p.appendChild(em2)
            div.appendChild(img)
            div.appendChild(p);
            li.appendChild(div);
            li.appendChild(h4)
            dayDate.appendChild(li)
        }
    }
   

    //风向
    var detail=pageOne.querySelector(".detail")
    var predict = detail.querySelector('.predict')
    var bodyTmp = detail.querySelector('.b_tmp')
    var humidity = detail.querySelector('.humidity')
    var direction = detail.querySelector('.direction')
    var bigIco = detail.querySelector('.detail_ico');

    bigIco.src = mv.app.changeIco(date.now.cond.txt).src;
    predict.innerHTML = date.now.cond.txt;
    bodyTmp.innerHTML = date.now.tmp;
    humidity.innerHTML = date.now.hum;
    direction.innerHTML = date.now.wind.dir;



    //空气质量
    airQlt()
    function airQlt() {
        var airQlt = pageOne.querySelector('.air_qlt')
        var grade = airQlt.querySelector('.grade')
        var airIndex = airQlt.querySelector('.air_index')

        var ring = airQlt.querySelector('.ring')
        var rect = airQlt.querySelector('.rect').getElementsByTagName('li');

        if (date.aqi === undefined) {
            return;
        }

        grade.innerHTML = date.aqi.city.qlty?date.aqi.city.qlty:'';
        var aqi=date.aqi.city.aqi
        airIndex.innerHTML = aqi;

        findIndex();
        function findIndex() {
            var index = 0;
            var left = 0;
            var arr = [0, 50, 100, 150, 200, 300, 500]
              for (var i = 0; i < arr.length; i++) {
                    if(arr[i]<aqi){
                        index = i;
                        }
                    }
              for (var j = 0; j < index; j++) {
                  left += rect[j].offsetWidth
              }
              ring.style.left = left + rect[index].offsetWidth / 2 + 'px';
        }
       
    }
   

    //污染物指数
    var pollute = pageOne.querySelector('.pollute');
    var pTwo = pageOne.querySelector('.PM_two');
    var pTen = pollute.querySelector('.PM_ten');
    var SO = pollute.querySelector('.SO');
    var oThree = pollute.querySelector('.o_three');
    var NO = pollute.querySelector('.NO');
    var CO = pollute.querySelector('.CO');

    if (date.aqi!= undefined) {
        pTwo.innerHTML = date.aqi.city.pm25 ? date.aqi.city.pm25 : '';
        pTen.innerHTML = date.aqi.city.pm10 ? date.aqi.city.pm10 : '';
        SO.innerHTML = date.aqi.city.so2 ? date.aqi.city.so2 : '';
        oThree.innerHTML = date.aqi.city.o3 ? date.aqi.city.o3 : '';
        NO.innerHTML = date.aqi.city.no2 ? date.aqi.city.no2 : '';
        CO.innerHTML = date.aqi.city.co ? date.aqi.city.co : '';
    }
    

    //生活指数
    lifeIndex()
    function lifeIndex() {
        var lifeIndex = pageOne.querySelector('.life_index');

        var clothes = lifeIndex.querySelector('.clothes');
        var cText = lifeIndex.querySelector('.c_text');

        var cold = lifeIndex.querySelector('.cold');
        var coText = lifeIndex.querySelector('.co_text');

        var light = lifeIndex.querySelector('.light');
        var lText = lifeIndex.querySelector('.l_text');

        var sport = lifeIndex.querySelector('.sport');
        var sText = lifeIndex.querySelector('.s_text');

        var car = lifeIndex.querySelector('.car');
        var carText = lifeIndex.querySelector('.car_text');


        clothes.innerHTML = date.suggestion.drsg.brf;
        cText.innerHTML = date.suggestion.drsg.txt

        cold.innerHTML = date.suggestion.flu.brf;
        coText.innerHTML = date.suggestion.flu.txt

        light.innerHTML = date.suggestion.uv.brf;
        lText.innerHTML = date.suggestion.uv.txt

        sport.innerHTML = date.suggestion.sport.brf;
        sText.innerHTML = date.suggestion.sport.txt

        car.innerHTML = date.suggestion.cw.brf;
        carText.innerHTML = date.suggestion.cw.txt
    }

  }

mv.app.changeIco = function (arr) {

    var weather = ['晴', '多云', '阴', '阵雨', '雷阵雨', '小雨', '中雨', '大雨', '暴雨', "大暴雨"];
    var index = null;
    
    var weaSrc = {};
    var src = null;
    var bg = null;

    for (var i = 0; i < weather.length;i++){
        if (weather[i] === arr) {
            index = i;
        }
    }
    if (!index&&index!=0) {
        index = 99999;
    }
    
    switch (index) {
        case 0:
            weaSrc.bg = 'images/bg/sun_bg.png'; break;
        case 1:
        case 2:
            weaSrc.bg = 'images/bg/clod_bg.png'; break;
        case 3:
        case 4:
            weaSrc.bg = 'images/bg/thunder.png'; break;
        case 5:
        case 6:
        case 7:
            weaSrc.bg = 'images/bg/rain_bg.png'; break;
        default:
            weaSrc.bg = 'images/bg/sun_bg.png'; break;
    }

    switch(index){
        case 0:
            weaSrc.src = 'images/weather/sunshine.png'; break;
        case 1:
            weaSrc.src = 'images/weather/cloud.png'; break;
        case 2:
            weaSrc.src = 'images/weather/shade.png'; break;
        case 3:
            weaSrc.src = 'images/weather/shower.png'; break;
        case 4:
            weaSrc.src = 'images/weather/thu_rain.png'; break;
        case 5:
            weaSrc.src = 'images/weather/s_rain.png'; break;
        case 6:
            weaSrc.src = 'images/weather/m_rain.png'; break;
        case 7:
            weaSrc.src = 'images/weather/b_rain.png'; break;
        case 8:
            weaSrc.src = 'images/weather/h_rain.png'; break;
        case 9:
            weaSrc.src = 'images/weather/most_rain.png'; break;
        default:
            weaSrc.src = 'images/weather/cloud.png'; break;
    }
    mv.app.changeBg(weaSrc.bg)
    return weaSrc;
   
}

mv.app.changeBg = function (src) {
   var pageOne=document.querySelector('.pageOne')
    var myDate = new Date();
    var time = myDate.getHours();
    if (time > 17||time<5) {
        pageOne.style.backgroundImage = 'url(images/bg/e_bg.png)'
    } else {
        pageOne.style.backgroundImage = 'url(' + src + ')'
    }
}

mv.app.changeX = function (num) {
    var move = document.getElementById('wrap').querySelector('.move');
    var page = document.getElementById('wrap').querySelectorAll('.page')

    var pageL = page.length
    var pageW = page[0].offsetWidth;

    move.style.left = -num * pageW + 'px';

}

mv.app.removeChild = function () {

    //移除第一页时刻温度和预报
    var pageOne = document.querySelector('.pageOne');
    var hourly = pageOne.querySelector('.hourly_inner')
    var hOl = hourly.getElementsByTagName('ol')[0];

    var daily = pageOne.querySelector('.daily')
    var dOl = daily.getElementsByTagName('ol')[0];

    hOl.innerHTML = " ";
    dOl.innerHTML = " ";

    var exist = document.querySelector('.pageThree').querySelector('.isExist')
    exist.innerHTML = '';
   
}

mv.app.pageTwoLi=function(cityName,isPosition) {
    var pageTwo = document.querySelector('.pageTwo');
    var searched = pageTwo.querySelector('.searched');

    var oLi = searched.children;
    var off = true;

    ajax('post', 'https://free-api.heweather.com/v5/weather?city=' + cityName + '&key=4296492e2f4d41e18ebb6a02b5ec110a', '', function (date) {
        var date = JSON.parse(date);
        for (var i = 0; i < oLi.length; i++) {
            var text = oLi[i].getElementsByTagName('p')[0].getElementsByTagName('h4')[0].innerHTML;
            if (text === date.HeWeather5[0].basic.city) {
                off = false;
            } else {
                off = true
            }
        }

            if (off) {
                var li = document.createElement('li');
                //li.index=;
                var oP = document.createElement('p');
                var h4 = document.createElement('h4');
                var span = document.createElement('span');
                  
                h4.innerHTML = date.HeWeather5[0].basic.city;
                span.innerHTML = date.HeWeather5[0].now.tmp;

                oP.appendChild(h4);

                if (isPosition) {                             //若是定位就添加一个定位标志
                    var img = document.createElement('img');
                    img.src = 'images/position_ico.png';
                    oP.appendChild(img)
                }

                li.appendChild(oP);
                li.appendChild(span);

                if (!isPosition) {    
                    searched.appendChild(li);
                }

                if (isPosition)
                {
                    if (searched.children.length) {
                        searched.insertBefore(li,oLi[0]);
                    } else {
                        searched.appendChild(li)
                    }
                }
                var bgSrc = mv.app.changeIco(date.HeWeather5[0].now.cond.txt)
                li.style.backgroundImage = 'url(' + bgSrc.bg + ')';
            }

    })

}


mv.tool.myScroll = function (init) {

    var swiper = init.el.children[0];
    var startPoint = {};
    var startEl = {};
    var lastPoint = {};
    var dir = init.dir;
    var max = {
        x: parseInt(css(init.el,"width") - css(swiper,"width")),
        y: parseInt(css(init.el,"height") - css(swiper,"height"))
    };
    var translate = {
        x: "translateX",
        y: "translateY"
    };
    var isMove = {
        x: false,
        y: false
    };

    var offset = {
        x: 'offsetWidth',
        y:'offsetHeight',
    }
    var isFrist = true;//记录这是第一次滑动 

    // css(swiper,"translateX",0);
    // css(swiper,"translateY",0);
    css(swiper,translate[dir],0);
    init.el.addEventListener('touchstart', function(e) {
        init.start&&init.start();
        var touch = e.changedTouches[0]

        startPoint = {
            x: Math.round(touch.pageX),
            y: Math.round(touch.pageY)
        };
        lastPoint= {
            x: startPoint.x,
            y: startPoint.y
        };
        startEl = {
            x: css(swiper,"translateX"),
            y: css(swiper,"translateY")
        };

        max = {
            x: parseInt(css(init.el,"width") - css(swiper,"width")),
            y: parseInt(css(init.el,"height") - css(swiper,"height"))
        }      
    });
    init.el.addEventListener('touchmove', function (e) {
        init.move && init.move();
        var touch = e.changedTouches[0];
        var nowPoint = {
            x: Math.round(touch.pageX),
            y: Math.round(touch.pageY)
        }
        if(lastPoint.x == nowPoint.x && lastPoint.y == nowPoint.y){
            return;
        }
        var dis = {
            x: nowPoint.x - startPoint.x,
            y: nowPoint.y - startPoint.y
        }
        /* 这个判断只在我手指按下时，第一次move时才会执行 */
        if(Math.abs(dis.x) - Math.abs(dis.y) > 2 && isFrist){
            isMove.x = true;
            isFrist = false;
        } else if(Math.abs(dis.y) - Math.abs(dis.x) > 2 && isFrist){
            isMove.y = true;
            isFrist = false;
        }
        var target = {};
        target[dir] = dis[dir] + startEl[dir];
        isMove[dir]&&css(swiper,translate[dir],target[dir]);
        lastPoint.x = nowPoint.x;
        lastPoint.y = nowPoint.y;
    });
    init.el.addEventListener('touchend', function (e) {

        if (lastPoint.x == startPoint.x && lastPoint.y == startPoint.y) {
            return;
        }

        //若子元素小于父级，则返回
        if (dir === 'x') {
            if (swiper.offsetWidth < init.el.offsetWidth) {
                init.end && init.end();
                return;
            }
        } else if (dir === 'y') {
            if (swiper.offsetHeight < init.el.offsetHeight) {
                init.end && init.end();
                return;
            }
        }

        var now = css(swiper, translate[dir]);
        if(now < max[dir]){
            now =  max[dir];
        } else if(now > 0){
            now = 0;
        }
        var target = {};
        target[translate[dir]] = now;
      
        MTween({
            el: swiper,
            target:target,
            type: "easeOut",
            time: 300
        });
        isMove = {
            x: false,
            y: false
        }
        isFrist = true;
    });


}

mv.app.getPosition = function () {
    
    //获取经纬度
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(sussFn,filedFn);
    } else {
        alert("对不起，您的浏览器不支持html5定位");
    }
    var isSucss = false;
    //定位请求成功后执行
    function sussFn(position) {
        var x = position.coords.latitude;
        var y = position.coords.longitude;
        
        var oScript = document.createElement('script')
        oScript.src = 'http://api.map.baidu.com/geocoder/v2/?callback=getCity&location='+x+','+y+'&output=json&pois=1&ak=oy486863FupMPGarwgzWXcyfslICpqrM '
        document.body.appendChild(oScript);
        isSucss = true;
    }
   

    function filedFn(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
            case error.POSITION_UNAVAILABLE:

                alert('无法获取当前位置');
                break;
            case error.TIMEOUT:
                alert('操作超时')
                break;
        }
        isSucss = false;
    }

}

//定位跨域请求成功后的回调
function getCity(date) {
    //alert(date.result.addressComponent.city)
    //请求成功以后就添加当前位置的天气
    var city = date.result.addressComponent.city
    mv.app.pageTwoLi(city, true);

    return city;
}


















