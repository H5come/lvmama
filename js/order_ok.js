var Vue = new Vue({
    el:"#orderOk",
    data(){
        return{
            loading:true,
            password:"", //输入密码
            goods:{}, //产品信息
            orderTime:"", //订单时间
            timer:"", //倒计时显示时间
            cartName:"",
            modal6:false,
            message:""
        }
    },
    created(){
        this.getData();
    },
    mounted(){
        
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
            axios.get(web_url+'lmm/order_pay.php',{params:target}).then(function(res){
                self.$Spin.hide();
                self.loading = false;
                // console.log(res)
                if(res.data.code == 200){
                    self.goods = res.data.data.createorder;
                    self.orderTime = res.data.data.ordertime;
                    self.cartName = res.data.data.username;
                    self.Countdown();
                }else if(res.data.code == 300){
                    alert(res.data.message,"",function(){
                        window.location.href = "/lvmama_pc_index.php";
                    })
                }else{
                    alert("订单超时","",function(){
                        window.location.href = "/lvmama_pc_index.php";
                    })
                }
            })
        },
        getData:function(){
            var ordersn =  getQueryString("a"),self = this;
            self.Axios({ordersn:ordersn},self);
        },
        passReg:function(item){//匹配密码是否正确
            var reg = /^\d{6}$/;
            return reg.test(item);          
        },
        ok:function(){
            window.location.href = "/lvmama_pc_index.php";
        },
        Countdown:function(){ //倒计时函数
            console.log(2,this.orderTime)
            var timer,self = this;
            clearInterval(timer);
            timer = setInterval(function(){
                if(self.orderTime > 0){
                    var minute = Math.floor(self.orderTime/60%60); //分
                    var second = Math.floor(self.orderTime%60); //秒
                    var hour = Math.floor(self.orderTime/3600); //时
                    hour < 10? hour = "0"+ hour : hour;
                    minute < 10? minute = "0"+ minute : minute;
                    second < 10? second = "0"+ second : second;
                    self.timer = hour + "小时" + minute + "分钟" + second + "秒";
                    self.orderTime--;
                }else{
                    clearInterval(timer);
                    alert("订单超时","",function(){window.location.href = "/lvmama_pc_index.php";});
                }
            },1000*1);
        },
        pay:function(){
            var flag = this.passReg(this.password),isRun = true;
            var target={password:this.password,ordersn:this.goods.orderSn,act:"pay"}
            if(flag){ //如果正确 ，请求接口
                if(isRun == true){
                    axios.get(web_url+'lmm/order_pay.php',{params:target}).then(function(res){
                        // console.log(res);
                        if(res.data.code == 200){
                            window.location.href = "/lvmama_pc_payOk.php";
                        }else{
                            alert(res.data.message);
                        }
                    })
                    isRun = false;
                }
                setTimeout(function(){
                    isRun = true;
                },1000*2)   
            }else{
                alert("请输入正确的密码！");
            }
        }
    }
});