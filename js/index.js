var Vue = new Vue({
    el:"#index",
    data:{
        // return{
            loading:true,
            loading1:true,
            show:false,//错误弹框是否显示标志
            showMessage:"",//错误提示信息
            banner:[],
            messageEnd:"",//搜索框目的地，
            zhuti:[],//主题数组
            floorTopic:[]//楼梯主题数组
        // }       
    },
    created:function(){
        var self = this;
        self.getData();
        
    },
    methods:{
        getData:function(){
            var self = this;
            self.$Spin.show({
                render: function(h){
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
            axios.get(web_url+"lmm/index.php").then(function(res){
                self.$Spin.hide();   
                self.loading = false;
                // self.loading1 = false;             
                // console.log(res);               
                if(res.data.code == 200){
                    self.banner = res.data.data.banner;
                    self.zhuti = res.data.data.zhuti;
                    res.data.data.list.forEach(function(item,index){
                        if(item.list != "null"){
                            self.floorTopic.push(item);
                        }
                    });
                    self.$nextTick(function(){
                        if(self.floorTopic.length == 0){
                            $("div.footer").css({bottom:"0"})
                        }else{
                            $("div.footer").css({bottom:"auto"})
                        }
                        self.bannerSlide();
                    });     
                }else{
                    self.show = true;
                    self.showMessage = res.data.message;//错误提示内容
                }
            });
        },
        toListPage:function(item){//通过主题进入列表页
            // console.log(item);
            window.location.href = "/lvmama_pc_list.php?id="+item.id+"&name="+item.othername;
        },
        submitToListPage:function(){//搜索功能进入列表页
            var self = this;
            if(self.messageEnd != ""){
                window.location.href = "/lvmama_pc_list.php?keyWord="+self.messageEnd;
            }else{
                self.$Message.warning("请输入有效内容！");
            }
            
        },
        bannerSlide:function(){
            /*头部轮播js语句*/
            jQuery(".fullSlide").hover(function() {
                jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.5)
            }, function() {
                jQuery(this).find(".prev,.next").fadeOut()
            });
            jQuery(".fullSlide").slide({
                titCell: ".hd ul",
                mainCell: ".bd ul",
                effect: "fold",
                autoPlay: true,
                autoPage: true,
                trigger: "click",
                delayTime:1000,
                interTime:4000,
                startFun: function(i) {
                    var curLi = jQuery(".fullSlide .bd li").eq(i);
                    if (!!curLi.attr("_src")) {
                        curLi.css("background-image", curLi.attr("_src")).removeAttr("_src")
                    }
                }
                });
            // jQuery(".txtMarquee-top").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",interTime:100,trigger:"click"});
            /*头部轮播js语句*/
            /*主题滚动效果js语句*/
            jQuery(".row").slide({
                titCell:".hd ul",
                mainCell:".bd ul",
                autoPage:true,
                effect:"left",
                autoPlay:false,
                scroll:1,
                vis:6,
                easing:"swing",
                delayTime:500,
                pnLoop:false,
                trigger:"click",
                mouseOverStop:true
            });

            /*主题滚动效果js语句*/
        },
        todetail:function(item){
            window.location.href = "/lvmama_pc_detail.php?proId="+item.productId;
        },
        getProduct:function(name,url){
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
                var r = url.substr(1).match(reg); 
                if (r != null) return decodeURI(r[2]); 
        },
        bannertoDetail:function(name,item){
            console.log(name); 
            var name = name,url = item.ad_link;
            var product_id = this.getProduct(name,url);
            window.location.href = "/lvmama_pc_detail.php?proId="+product_id;
        }

    }
})