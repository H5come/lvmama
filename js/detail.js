var Vue = new Vue({
    el:"#detail",
    data(){
        return{
            loading:true, //加载展示框
            product:{},//产品详情
            goods:[],//商品数组
            bigImage:""//大图图片
        }
    },
    created(){
        this.getData();
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
            axios.get(web_url+'lmm/info.php',{params:target}).then(function(res){
                // console.log(res);
                that.$Spin.hide();
                that.loading = false;
                if(res.data.code == 200){
                    that.product = res.data.data.product; //产品对象
                    that.goods = res.data.data.goods; //商品数组
                    that.bigImage = that.product.images[0];
                    that.$nextTick(function(){
                        that.bannerSlide();
                    });
                }else{
                    alert(res.data.data.message);
                }
            });
        },
        getData:function(){//获取数据
            var self = this;
            var filter = self.getQueryString("proId");
            self.Axios({"product_id":filter},self);
        },
        showInfo:function(item){//展示详细信息
            if($(".down"+item).hasClass("upActive") == false){
                $(".down"+item).addClass("upActive").removeClass("downActive");
                $('.info'+item).show();
            }else{
                $(".down"+item).removeClass("upActive").addClass("downActive");
                $('.info'+item).hide();
            }
        },
        scroll:function(){ //点击立即预定，向上滚动页面
            $(window).scrollTop(500)
        },
        Predefined:function(item){ //预定
            var date =  getNowFormatDate();
            window.location.href = "/lvmama_pc_order.php?a="+item+"&b="+ date; //预定ID
        },
        getQueryString:function (name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return decodeURI(r[2]); 
            return null; 
        },
        bannerSlide:function(){
            /*主题滚动效果js语句*/
            jQuery(".smallPhotos").slide({
                titCell:".hd ul",
                mainCell:".bd ul",
                autoPage:true,
                effect:"left",
                autoPlay:false,
                scroll:1,
                vis:5,
                easing:"swing",
                delayTime:500,
                pnLoop:false,
                trigger:"click",
                mouseOverStop:true
            });
        },
        toBigSrc:function(item){
            this.bigImage = item;
        }
    }
});