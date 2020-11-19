/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/Message.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('message', require('./components/Message.vue').default);
import Vue from 'vue'

import Toaster from 'v-toaster'
import 'v-toaster/dist/v-toaster.css'
Vue.use(Toaster, {timeout: 5000})


import VueChatScroll from 'vue-chat-scroll'
Vue.use(VueChatScroll)
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data:{
        message:'',
        chat:{
            message:[],
            user:[],
            color:[],
            time:[],

        },
        typing:'',
        noOfUsers:0
    },
    watch:{
      message(){
          Echo.private('chat')
              .whisper('typing', {
                  name: this.message
              });
      }
    },
    methods:{
        send(){
            if(this.message.length != 0){
               this.chat.message.push(this.message);
               this.chat.user.push('You');
               this.chat.color.push('success');
               this.chat.time.push(this.getTime());
               axios.post('/send',{
                   message:this.message,
                   chat:this.chat
               }).then(res=>{
                   console.log(res);
                   this.message='';
               }).catch(e=>{
                    console.log(e);
                })
            }
        },
        getTime(){
            let time=new Date();
            return time.getHours()+':'+time.getMinutes();
        },
        getOldMessages(){
            axios.post('/getOldMessage').then(response=>{
                console.log(response);
                if(response.data != ''){
                    this.chat=response.data;
                }
            }).catch(err=>{
                console.log(err)
            })
        }

    },
    mounted() {
        this.getOldMessages();
        Echo.private('chat')
            .listen('ChatEvent', (e) => {
                this.chat.message.push(e.message);
                this.chat.color.push('warning');
                this.chat.user.push(e.user);
                this.chat.time.push(this.getTime());

                axios.post('/saveToSession',{
                    chat:this.chat
                }).then(response=>{

                }).catch(err=>{
                    console.log(err)
                })
            })
            .listenForWhisper('typing', (e) => {
              if(e.name != ''){
                  this.typing ='Typing...'
              }else{
                  this.typing=''
              }
            })
        Echo.join(`chat`)
            .here((users)=>{
                this.noOfUsers = users.length;
            })
            .joining((user)=>{
                this.noOfUsers += 1;
                this.$toaster.success(user.name+' '+'joined the chat room');
            })
            .leaving((user)=>{
                this.noOfUsers -= 1;
                this.$toaster.warning(user.name+' '+'left the chat room');
            });

    }
});
