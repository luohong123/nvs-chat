<template>
<div class="headerbar">
  <span class="left" v-if="left">{{left}}</span>
  <span class="title" v-if="title">{{title}}</span>
  <i class="icon iconfont icon-gengduo more toggle" v-on:click="toggle"></i>
</div>
</template>

<script>
import {eventHub} from '@/utils/event-bus';
import {getUserName} from '@/utils';
export default {
  name: 'HeaderBar',
  props: ['title', 'more', 'left'],
  data(){
    return {
      userName:getUserName()
    }
  },
  methods: {
    toggle: function () {
      eventHub.$emit('toggle');
    }
  }
}
</script>

<style>
.headerbar {
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
  color: #000;
  padding-left: 30px;
  padding-right: 15px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  justify-content: space-between;
}

.headerbar .title {
  font-size: 20px;
}

.headerbar .more {
  color: #5E5E5E;
  cursor: pointer;
}

.headerbar .more:hover {
  color: #000;
}
</style>
