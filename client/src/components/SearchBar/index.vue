<template>
<div class="searchbar">
  <i class="icon iconfont icon-sousuo"></i>
  <input type="text" v-model="value" placeholder="搜索" v-on:click="search">
</div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      value: ''
    }
  },
  created() {
 
  },
  methods: {
    /**
     * 查询
     */
    search: function () {
      this.$emit('search', {
        value: this.value
      });
    }
  }
}
</script>

<style>
.searchbar {
  position: relative;
}

.searchbar .iconfont {
  color: #333;
  font-size: 12px;
  margin-right: 10px;
  position: absolute;
  left: 5px;
  top: 2px;
}

.searchbar>input {
  width: 100%;
  outline: none;
  border: 0;
  background: #DBD9D8;
  padding-left: 25px;
  color: #000;
  font-size: 12px;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
