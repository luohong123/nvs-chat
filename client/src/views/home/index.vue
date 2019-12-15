<template>
  <div class="home">
<card/>
  </div>
</template>
<script>
import card from '@/components/Card';
export default {
  name: 'home',
  components: {
    card
  }
}
</script>
<style>
.home {
  padding: 10px;
  background: #ccc;
}
</style>