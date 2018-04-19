var Vue = new Vue({
    el:"#orderDetail",
    data(){
        return{
            loading:true,
            order:{},
            password:"", //密码
            settlement:false //结算div是否展现
        }
    },
    created:function(){
        this.getData();
    },
    mounted:function(){
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
            axios.get(web_url+'lmm/order_info.php',{params:target}).then(function(res){
                self.$Spin.hide();
                self.loading = false;
                // console.log(res);
                if(res.data.code == 200){
                   self.order = res.data.data.info;
                   if(self.order.is_code == 2 || self.order.is_code == 3){
                    self.settlement = true;
                   }
                }else{
                    alert(res.data.data.message);
                }
            })
        },
        getData:function(){
            var obj = {ordersn:getQueryString("ordersn"),act:"info"},self = this; //这是判断订单是否为带付款状态
            this.Axios(obj,self);
        },
        passReg:function(item){//匹配密码是否正确
            var reg = /^\d{6}$/;
            return reg.test(item);          
        },
        pay:function(){
            window.location.href="/lvmama_pc_orderOk.php?a="+this.order.orderSn;
        }
    }
})