<template>
  <!--
    多页预览容器：
    - 按页循环渲染 PageSheet
    - id=printArea 便于后续扩展为“局部打印”时快速定位
  -->
  <div class="preview-wrap" id="printArea">
    <PageSheet
      v-for="page in pages"
      :key="page.pageNo"
      :page="page"
      :config="config"
      :template="template"
    />
  </div>
</template>

<script setup lang="ts">
import PageSheet from "./PageSheet.vue";
import type { pageData, sheetConfig, templateKind } from "../types/worksheet";

interface previewProps {
  pages: pageData[];
  config: sheetConfig;
  template: templateKind;
}

defineProps<previewProps>();
</script>
