<template>
  <div class="addresslist">
    <div class="group-item" v-for="item in groups" v-bind:key="item.GROUPID">
      <a-card hoverable style="width: 100%;">
        <template class="ant-card-actions" slot="actions">
          <!-- <a-icon type="plus-circle" /> -->
          <span v-on:click="joinGroup(item)">加入群</span>
        </template>
        <a-card-meta :title="item.GROUPNAME" :description="item.GROUPREMARK">
          <a-avatar slot="avatar" :src="item.AVATAR" />
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script>
import { getGroupInfoList } from '@/api/chat';

export default {
  name: 'addresslist',
  data() {
    return {
      groups: []
    };
  },
  mounted() {
    this.getGroups();
  },
  methods: {
    /**
     * 获取群信息
     */
    getGroups: function() {
      getGroupInfoList().then(result => {
        if (result.code === '0') {
          this.groups = result.data.groups;
        }
      });
    },
    /**
     * 加入群
     */
    joinGroup: function(item) {}
  }
};
</script>

<style>
.addresslist {
  display: flex;
  flex-wrap: wrap;
}
.group-item {
  width: 30%;
  margin: 10px;
}
</style>
