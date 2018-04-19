var Vue = new Vue({
    el:"#payOk",
    data(){
        return{
        }       
    },
    created(){
    },
    mounted(){
    },
    methods:{
        backIndex:function(){
            window.location.href = "/lvmama_pc_index.php";
        },
        backMyOrder:function(){
            window.location.href = "/user.php?act=lvmama_pc_order";
        }
    }

})