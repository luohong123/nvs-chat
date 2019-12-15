<template>
<div class="card">
  <router-link to="/chatDetail">
    <p><strong>房间:</strong><span>前端爱好者</span></p>
    <p><strong>描述:</strong><span>一群喜欢前端的小伙伴</span></p>
    <p><strong>在线人数:</strong><span>100人</span></p>
    <button type="button">进入聊天室</button>
  </router-link>
</div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style>
.card {
  background: #fff;
  padding: 10px 20px;
}
</style>
