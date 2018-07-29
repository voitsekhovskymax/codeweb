import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import './locale';
import './styles/common.less';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import vmodal from 'vue-js-modal';
import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);
Vue.use(vmodal);
Vue.use(VueI18n);
Vue.use(iView);

console.log('╭━┳━╭━╭━╮╮ \n' +
    '┃┈┈┈┣▅╋▅┫┃ \n' +
    '┃┈┃┈╰━╰━━━━━━╮ \n' +
    '╰┳╯┈┈┈┈┈┈┈┈┈◢▉◣ \n' +
    '╲┃┈┈┈┈┈┈┈┈┈┈▉▉▉ \n' +
    '╲┃┈┈┈┈┈┈┈┈┈┈◥▉◤ \n' +
    '╲┃┈┈┈┈╭━┳━━━━╯ \n' +
    '╲┣━━━━━━┫');
console.log("HOW ARE YOU DOING?")


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
