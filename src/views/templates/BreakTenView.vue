<template>
  <!--
    破十法页：
    - 使用破十专用生成与几何版式。
  -->
  <MathEditor title="破十法练习" template="breakTen" :show-range="false" :show-ops="false" />
</template>

<script setup lang="ts">
import MathEditor from "../../components/MathEditor.vue";
</script>
