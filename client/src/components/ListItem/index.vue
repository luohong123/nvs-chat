<template>
  <ul class="list-item">
    <li
      class="list-item-every"
      v-for="(item, index) in list"
      v-bind:key="item.messageid"
      v-bind:class="{ active: currentIndex === index }"
      v-on:click="changeMessage(item, index)"
    >
      <img class="avatar" :src="item.avatar" alt="avator" />
      <div class="list-item-right">
        <div class="list-item-header">
          <span class="title">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
        <div class="list-item-content">
          <span class="text">{{ item.content }}</span>
          <i class="icon iconfont"></i>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { eventHub } from '@/utils/event-bus';
export default {
  name: 'ListItem',
  props: ['list'],
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    changeMessage: function(item, index) {
      this.currentIndex = index;
      eventHub.$emit('change', item);
    }
  }
};
</script>

<style>
.list-item-every {
  width: 100%;
  height: 66px;
  padding: 12px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}

.list-item-every:hover,
.list-item-every.active {
  background: #dedcdb;
}

.list-item-right {
  flex: 1;
  white-space: nowrap;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  object-fit: cover;
  margin-right: 10px;
}

.list-item-header {
  display: flex;
  justify-content: space-between;
}

.list-item-header .title {
  width: 65%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.list-item-every .title {
  color: #000;
}

.list-item-every .time {
  color: #606060;
  font-size: 12px;
  transform: scale(0.8);
}

.list-item-content {
  color: #606060;
  margin-top: 8px;
}

.list-item-content .text {
  width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
