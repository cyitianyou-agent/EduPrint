<template>
  <!--
    根容器仅负责承载路由页面。
    业务页面切换统一由 Router 控制，避免在根组件堆积逻辑。
  -->
  <RouterView />
</template>

<script setup lang="ts">
// 当前根组件无需脚本逻辑。
// 保留 script setup 便于后续引入全局布局控制（如主题、全局对话框等）。
</script>
