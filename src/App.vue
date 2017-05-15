<template>
	<div>
		<transition name="router-fade" mode="out-in">
    		<router-view></router-view>
    	</transition>
    </div>
</template>

<script>
	//import {mapMutations} from 'vuex'
  	export default {
		// data() {
        //     return {
        //         shopid:''
        //     }
        // },
		// created() {
		// 	let me=this;
        //     me.shopid= this.$route.params.shopid;
		// 	if(me.shopid){
 		// 		me.SAVE_SHOPID(me.id);
		// 	}
        // },
		//  methods: {
        //      ...mapMutations([
        //         'SAVE_SHOPID'
        //     ]),
        // }
  	}

</script>

<style lang="scss">
  	 @import './style/common';
	// .router-fade-enter-active, .router-fade-leave-active {
	//   	transition: opacity .3s;
	// }
	// .router-fade-enter, .router-fade-leave-active {
	//   	opacity: 0;
	// }
	
</style>
