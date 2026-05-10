<template>
  <!--
    凑十法页：
    - 题目结构固定，隐藏通用范围与运算切换。
  -->
  <MathEditor title="凑十法练习" template="makeTen" :show-range="false" :show-ops="false" />
</template>

<script setup lang="ts">
import MathEditor from "../../components/MathEditor.vue";
</script>
