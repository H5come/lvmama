var Vue = new Vue({
    el:"#index",
    data(){
        return{
            show:false,//错误弹框是否显示标志
            showMessage:"",//错误提示信息
            mainTopic:[],//主题数组
            floorTopic:[]//楼梯主题数组
        }       
    },
    created(){
        this.getData();
    },
    mounted(){

    },
    methods:{
        getData:function(){
            var self = this;
            axios.get(web_url+"lmm/index.php").then(function(res){
                console.log(res);
                if(res.data.code == 200){
                    self.= 
                }else{
                    self.show = true;
                    self.showMessage = res.data.message;//错误提示内容
                }
            });
        }
    }
})