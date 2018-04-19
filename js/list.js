var Vue = new Vue({
    el:"#list",
    data(){
        return{
            kw:getQueryString("keyWord"),
            loading:true,
            result:false,//有无搜索结果标志
            paixuresult:false, 
            searchTerms:"",//首页搜索词
            messageEnd:"",//列表页搜索词
            banner:[],
            //expand:true,
            expand1:true,
            //expandFlag:true,目的地展开收起标志
            expandFlag1:true,//主题展开收起标志
            height:"",
            url:window.location.href,
            //Regional:[],包含区域
            themes:[],//主题
            paixu:[],//综合排序
            currentPageNum:1,//当前页码数
            pagesTotal:1,//上册分页总数
            totalPages:1,//总页数
            list:[],//列表
            filters:{
                pxId :'1_5',
                zhutiId:"2_"+getQueryString("id")
            }//筛选条件集合
        }       
    },
    created(){
        
    },
    mounted(){
       this.height = $(".destinationDiv").height();
        this.getData();
    },
    methods:{
        Axios:function(target,that,flag){
            // console.log(target);
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
            axios.get(web_url+'lmm/list.php',{params:target}).then(function(res){
                console.log(res);
                that.$Spin.hide();
                that.loading = false;
                if(res.data.code == 200){                   
                    that.paixuresult = that.result = false;
                    that.paixu = res.data.data.paixu[0].pxchild;
                    that.themes = res.data.data.paixu[1].pxchild;
                    that.Regional = res.data.data.paixu[2].pxchild;
                    that.banner = res.data.data.banner;
                    that.pagesTotal = res.data.data.page_total;
                    that.totalPages = res.data.data.total;
                    that.list = res.data.data.list;
                    that.$nextTick(function(){
                        that.bannerSlide();
                    });
                    that.$nextTick(function(){
                        $(".pageStyle .ivu-page-options .ivu-page-options-elevator input").attr({"type":"number","spellcheck":"true"});
                    });
                }else if(res.data.code == 300){
                    if(flag == ""){
                        that.result = true;
                    }else if(flag == "paixu"){
                        that.paixuresult = true;
                        // that.Regional = res.data.data.paixu[2].pxchild;
                        that.paixu = res.data.data.paixu[0].pxchild;
                        that.themes = res.data.data.paixu[1].pxchild;
                        that.pagesTotal = 1;//上册分页总数
                        that.totalPages = 1;//总页数
                    }
                }else{
                    alert(res.data.data.message);
                }
            });
        },
        getData:function(){
            var self = this;
            if(getQueryString("keyWord") == null){ //通过点击在主题
                var paramsObj = {id:getQueryString("id"),otherName:getQueryString("name")};
            }else{
                var paramsObj = {keyWord:getQueryString("keyWord")};
            }
            // console.log(paramsObj);
            this.Axios(paramsObj,self,"");
        },
        bannerSlide:function(){//轮播
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
            /*头部轮播js语句*/
        },
        expands:function(item,target){
            // console.log(target);
            if(target == "expand"){
                this.expand = !this.expand;
                this.expand == true? this.expandFlag = true : this.expandFlag = false;
            }else{
                this.expand1 = !this.expand1;
                this.expand1 == true? this.expandFlag1 = true : this.expandFlag1 = false; 
            }   
        },
        selectMethod:function(id,targetFlag){
            this.kw = "";
            this.messageEnd = "";
            if(targetFlag == 4){//选择主题
                this.filters.zhutiId = id;
            }else if(targetFlag == 5 || targetFlag == 6 || targetFlag == 7){//选择综合,价格从高到底，从低到高
                this.filters.pxId = id;
            }
            this.currentPageNum = 1;
            var filterArr = [this.filters.zhutiId,this.filters.pxId];
            var self = this;
            this.Axios({"pxid":filterArr},self,"paixu");
        },//筛选内容
        change:function(item){//点击换页码回调的函数
            if(item == "left"){//页码减少
                if(this.currentPageNum <= 1){
                    alert("不能再少了啦~");
                    return;
                }else{
                    this.currentPageNum--;
                }
            }else if(item == "right"){//页码增加
                if(this.currentPageNum >= this.pagesTotal){
                    alert("不能再多了啦~");
                    return;
                }else{
                    this.currentPageNum++;
                }
            }else{
                console.log(event)
                this.currentPageNum = item;
            }
            var filterArr = this.currentPageNum;
            var self = this;
            var filterArrs = [this.filters.zhutiId,this.filters.pxId];
            console.log(filterArrs,self.filters);
            console.log(this.kw);
            console.log(this.messageEnd);
            if(this.messageEnd != ""){
                this.Axios({"page":filterArr,"keyWord":this.messageEnd},self,"")
            }else{
                if(this.kw!="" || this.kw!=undefined || this.kw!= null){
                    this.Axios({"page":filterArr,"pxid":filterArrs,"keyWord":this.kw},self,"")
                }else{
                    this.Axios({"page":filterArr,"pxid":filterArrs,"keyWord":this.messageEnd},self,"")
                } 
            }               
        },
        submitToListPage:function(){ //搜索方法
            var self = this;
            this.kw = "";
            self.currentPageNum = 1;
            if(self.messageEnd != ""){
                var filterArr = self.messageEnd;
                // console.log(filterArr,self.filters);
                window.history.pushState({keyWord:self.messageEnd},"","?keyWord="+self.messageEnd);
                this.Axios({"keyWord":filterArr},self,"");    
            }else{
                // console.log(this.url);
                window.location.href = this.url;
                this.getData();
            }
        },
        todetail:function(item){
            // window.open("/lvmama_pc_detail.php?proId="+item.productId);
            window.location.href = "/lvmama_pc_detail.php?proId="+item.productId;
        },
        getProduct:function(name,url){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = url.substr(1).match(reg); 
            if (r != null) return decodeURI(r[2]); 
        },
        bannertoDetail:function(name,item){
            var name = name,url = item.ad_link;
            var product_id = this.getProduct(name,url);
            window.location.href = "/lvmama_pc_detail.php?proId="+product_id;
        }
    }

})