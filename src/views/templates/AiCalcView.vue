<template>
  <!--
    AI 计算题页：启用运算方式与数值范围配置。
  -->
  <MathEditor title="AI生成计算题（规则出题）" template="aiCalc" :show-ops="true" :show-range="true" />
</template>

<script setup lang="ts">
import MathEditor from "../../components/MathEditor.vue";
</script>
