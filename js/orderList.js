var Vue = new Vue({
    el:"#orderList",
    data(){
        return{
            loading:true,
            orderlist:[],
            total:0, //总记录
            page_total:0, //总页数
            pagestatus:"", //下一页标志
            bottom:"bottom", //下拉框展开方向是向下
            pageOne:1 //默认是第一页
        }
    },
    created:function(){
        this.getData();
    },
    mounted:function(){
        
    },
    methods:{
        Axios:function(target,that){
            that.$Spin.show({//加载框
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
            axios.get(web_url+'lmm/order_info.php?act=list',{params:target}).then(function(res){
                // console.log(res);
                that.$Spin.hide();
                that.loading = false;
                if(res.data.code == 200){
                    that.orderlist = res.data.data.list;
                    that.total = res.data.data.total;
                    that.page_total = res.data.data.page_total;
                    that.pagestatus = res.data.data.pagestatus;
                    if(that.page_total >= 4){
                        that.bottom = "top";
                    }
                }else{
                    alert(res.data.message);
                }
            });
        },
        getData:function(){
            var that = this;
            that.Axios({},that);
        },
        orderDetail:function(ordersn){ //订单详情方法
            window.location.href = "/lvmama_pc_orderDetail.php?ordersn="+ordersn;
        },
        page:function(target){
            var that = this;  
            if(target == 1){ //第一页
                that.Axios({"page":1},that);
            }else if(target == "minus"){ //上一页
                console.log(that.pageOne);
                that.pageOne>1?that.pageOne--:that.pageOne = 1;
                that.Axios({"page":that.pageOne},that);
            }else if(target == "add"){ //下一页
                console.log(that.pageOne);
                that.pageOne<that.page_total?that.pageOne++:that.pageOne = that.page_total;
                that.Axios({"page":that.pageOne},that);
            }else if(target == "last"){ //最末页
                that.pageOne = that.page_total;
                that.Axios({"page":that.page_total},that);
            }
        },
        change:function(){
            console.log(this.pageOne);
            this.Axios({"page":this.pageOne},this);
        }
    }
})