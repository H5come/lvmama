var Vue = new Vue({
    el:"#order",
    data(){
        return{
            loading:true,
            needKnow:false,
            travellers:1, //出游人数
            options:{},
            select:"身份证",//身份证选择
            userArr:0,//填写信息的循环的数据
            valueDate:getQueryString("b"),//绑定当天的日期
            totalPrice:"",//总价格
            address:"",//收货地址
            goods:{},//商品
            length:2,
            ryxz:{},//入园需知
            price:[],//价格循环
            marketPrice:"",//每个产品的单价
            players:[], //游玩人数组
            phone:"", //验证电话
            name:"" //验证姓名
        }
    },

    created(){
        
    },
    mounted(){
        var self = this;
        this.$nextTick(function(){
            this.getData();
            $(".ivu-date-picker-editor input").attr('disabled',"disabled").css({"background":"#fff","color":"#666"}); 
        });
        this.options = { //日历插件option选项
            disabledDate:function(date){ //日期只能选当日起30日内的票
                return (date && date.valueOf() < Date.now() - 86400000) || (date && date.valueOf() > Date.now() + ((self.length-1)*86400000));
            }
        };
        $("body").on("click",function(){
            self.needKnow = false;
        })
    },
    methods:{
        Axios:function(target,self){//加载方法
            self.$Spin.show({//加载框
                render: (h) => {
                    return h('div', [
                        h('Icon', {
                            'class': 'demo-spin-icon-load',
                            props: {
                                type: 'load-c',
                                size: 22
                            }
                        }),
                        h('div', '加载中...')
                    ])
                }
            });
            axios(web_url+'lmm/order.php',{params:target}).then(function(res){
                self.$Spin.hide();
                self.loading = false;
                // console.log(res)
                if(res.data.code == 200){
                    self.$nextTick(function(){
                        $(".datePickId .ivu-date-picker-cells-cell-today").addClass("bgffa833").children("em").addClass("colorff");
                    });
                    self.goods = res.data.data.goods;
                    self.marketPrice = res.data.data.goods.price;       
                    self.price = res.data.data.price;
                    self.ryxz = self.goods.info.ryxz;
                    self.length = self.price.length;
                    self.totalPrices();
                    self.users(self.goods.buyer);
                }else{
                    alert(res.data.message)
                }
            })
        },
        getData:function(){ //页面渲染的方法
            var productId = getQueryString("a"),dateTime = getQueryString("b");//渲染只需要productId,当前日期
            var target = {"goods_id":productId,"date_time":dateTime},self = this;//参数名有goods_id,date_time
            this.Axios(target,self);
        },
        needShow:function(e){ //预定需知显示不显示的方法
            var e = e || window.event;
            e.cancelBubble = true; 
            e.stopPropagation();
            this.needKnow = !this.needKnow;
        },
        users:function(buyer){//需要填多少个游玩人信息
            if(buyer == "one"){//需要一个游玩人
                this.userArr = 1;
            }else if(buyer == "no"){//不需要游玩人
                this.userArrarr = 0;
            }else if(buyer == "all"){//需要全部游玩人
                this.userArr = this.travellers;
            }
        },

        totalPrices:function(){ //订单总金额
            this.totalPrice  = this.marketPrice * 100 * this.travellers / 100; //价格 * 人数 = 订单总价格
        }, 
        travellersNum:function(target){ //旅游人数加减
            if(target == 1){ //减法
                if(this.travellers <= 1){
                    alert("不能再减少了！");
                }else{
                    this.travellers--;
                }                
            }else if(target == 2){ //加法
                if(this.travellers >= 6){
                    alert("不能再增加了！");
                }else{
                    this.travellers++;
                }
            }
            this.users(this.goods.buyer);
            this.totalPrices();//改变人数量，改变总价格
        },
        player:function(){ //添加游玩人方法
            if(this.userArr != 0){
                for(var i=1;i<=this.userArr;i++){
                    var arr = {};
                    arr.playPhone = $("#phone"+i + " input").val();
                    arr.credentials = $("#id"+i + " input").val();
                    arr.playName = $("#name"+i + " input").val();
                    this.players.push(arr);
                    // console.log(arr);
                }
            }
        },
        change:function(date){ //点击改变日期得方法
            var self =  this,arr = [];
            var price =  this.price;
            arr.push
            self.valueDate = date; //获取点击选择的日期
            for(var i = 0;i < price.length;i++){
                if(self.valueDate == price[i].date){
                    self.marketPrice = price[i].price; //获取当天日期的价格    
                }
            }   
            self.totalPrices(); //改变日期，改变总价格
            self.$nextTick(function(){
                $(".ivu-date-picker-cells-cell-selected").addClass('bgffa833').children("em").addClass("colorff");
                $(".ivu-date-picker-cells-cell-selected").siblings().removeClass("bgffa833").children().removeClass("colorff");
                console.log($(".ivu-date-picker-cells-cell-selected").addClass('bgffa833').children("em").addClass("colorff").siblings().removeClass("bgffa833").children().attr("class"))
            });      
        },
        blur:function(item){ //input的失焦方法   
            var value = $("#"+item + " input").val(); //获取input的值
            if(item.indexOf("phone") != -1){ //如果是手机号
                if(!regphone.test(value)) alert("手机号码错误！"); 
            }else if(item.indexOf("id") != -1 ){ //如果是证件号
                if(!regId.test(value)) alert("证件号码错误！"); 
            }else if(item.indexOf("name") != -1 ){ //如果是姓名
                if(value == "" || value == undefined || value == null){
                    alert("姓名不能为空！1");
                }
            }
        },
        inputValue:function(){ //校验input框信息是否正确的方法
            var arr = []; //存储所有游玩人input的值，循环这个数组，看有没有为空的 ,所有input框的值
            if(this.goods.goodsSort == 'common'){ 
                if(this.name == "" || !regphone.test(this.phone)){ //取票人姓名和电话
                    alert("取票人信息填写有误，请检查！");
                    return;
                }
            }else if(this.goods.goodsSort == 'special'){
                if(this.name == "" || !regphone.test(this.phone) || this.address == ""){ //取票人姓名和电话
                    alert("取票人信息填写有误，请检查！");
                    return;
                }
            };
            $(".commonForm .ivu-input").each(function(index,item){  //循环所有游玩人的div 获取input的值
                arr.push($(item).val());
            })
            // console.log(arr);
            for(var i=0;i<arr.length;i++){
                if(arr[i] == ""){
                    alert("游玩人信息填写不完整，请检查!");
                    return;
                }
            }; 
        },
        toPay:function(){ //还得检测验证是否为空
            var play_time = $(".ivu-date-picker-editor input").val(); //笨方法
            var self = this,flag = true;
            self.players =  []; //先清空一下游玩人数组
            self.inputValue(); //  获取游玩人的value的数组
            self.player();
            var target = {
                number:this.travellers,
                product_id:this.goods.productId,
                goods_id:this.goods.goodsId,
                name:this.name,
                mobile:this.phone,
                play_time:play_time,
                player:this.players,
                address:this.address,
                buyer:this.goods.buyer,
                goods_name:this.goods.goodsName,
                goods_sort:this.goods.goodsSort
            };
            if(self.valueDate!=""&&self.travellers!=""&&this.name!=""&&regphone.test(self.phone)==true){
                if(flag == true){
                    for(var i=0;i<self.players.length;i++){
                        if(!regId.test((self.players)[i].credentials) || !regphone.test(self.players[i].playPhone) || self.players[i].playName == ""){
                            alert("游玩人信息填写有误！1");
                            return;
                        }
                    }                  
                    axios.get(web_url+'lmm/order_up.php',{params:target}).then(function(res){
                        // console.log("订单页数据",res);
                        if(res.data.code == 200){
                            window.location.href = "/lvmama_pc_orderOk.php?a="+res.data.data.ordersn;
                        }else{
                            if(res.data.message == "4005"){
                                alert("游玩人身份证号填写错误！");
                            }else if(res.data.message == "1005"){
                                alert("该产品已下线！1");
                            }else if(res.data.message == "1008"){
                                alert("该产品价格有点问题！");
                            }else if(res.data.message == "1011"){
                                alert("订单号有误，没有此订单！");
                            }else if(res.data.message == "1015"){
                                alert("该景区是到付，无需支付！");
                            }else if(res.data.message == "1033"){
                                alert("由于该产品限购，此手机号不能订购多张！");
                            }else if(res.data.message == "1051"){
                                alert("游玩人数与该产品要求人数有冲突！");
                            }else if(res.data.message == "1069"){
                                alert("该产品不在可售范围！");
                            }else if(res.data.message == "400"){
                                alert(res.data.text);
                            }else{
                                alert(res.data.text);
                            }
                            
                        }
                    })
                    flag = false;
                }
                setTimeout(function(){
                    flag=true;
                },1500);
            }else{
                alert("信息填写不完整，请检查！");
            }
            
        }

    }

});