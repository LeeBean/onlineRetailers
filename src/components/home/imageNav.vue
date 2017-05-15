<template>
    <nav  class="msite_nav" style="margin-top:0.3rem;">
        <div class="swiper-slide food_types_container">
            <a v-for="item in content" v-if="item.image!=''" href="#/food?geohash=wtw3sm0q087&amp;title=%E7%BE%8E%E9%A3%9F&amp;restaurant_category_id=207" class="link_to_food">
                <figure ><img  :src="getImgPath(item.image)">
                    <figcaption >{{item.title}}</figcaption>
                </figure>
            </a>
        </div>
    </nav>
</template>

<script>
    import {getImgPath} from '../common/mixin'
    export default {
        data() {
            return {
    
            }
        },
        mixins: [getImgPath],
        props: ['content'],
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .msite_nav {
        // padding-top: 2.1rem;
        background-color: #fff;
        border-bottom: 0.025rem solid $bc;
    }
    
    .food_types_container {
        display: flex;
        flex-wrap: wrap;
        .link_to_food {
            width: 25%;
            padding: 0.3rem 0rem;
            @include fj(center);
            figure {
                img {
                    margin-bottom: 0.3rem;
                    @include wh(1.8rem, 1.8rem);
                    border-radius: 0.9rem;
                }
                figcaption {
                    text-align: center;
                    @include sc(0.55rem, #666);
                }
            }
        }
    }
</style>
