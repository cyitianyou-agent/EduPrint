<template>
  <!--
    编辑页总布局：
    - 左侧控制面板（参数输入）
    - 右侧打印预览（多页）
  -->
  <main class="editor-page" :class="{ 'ai-editor': template === 'aiCalc' }">
    <MathControlPanel
      :title="title"
      :config="store.config"
      :template="store.template"
      :show-ops="showOps"
      :show-range="showRange"
      :notice="store.notice"
      :can-print="store.hasData"
      @generate="onGenerate"
      @print="onPrint"
    />

    <section class="preview-panel">
      <PrintPreview
        v-if="store.hasData"
        :pages="store.pages"
        :config="store.config"
        :template="store.template"
      />
      <div class="empty-panel" v-else>
        点击左侧“点击生成试题”后，会在这里展示可打印预览。
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import MathControlPanel from "./MathControlPanel.vue";
import PrintPreview from "./PrintPreview.vue";
import { useWorksheetStore } from "../stores/worksheet";
import type { sheetConfig, templateKind } from "../types/worksheet";

/**
 * 编辑页入参：
 * - title/template 由各模板路由页传入
 * - showOps/showRange 用于控制左侧字段显示
 */
interface editorProps {
  title: string;
  template: templateKind;
  showOps?: boolean;
  showRange?: boolean;
}

const props = withDefaults(defineProps<editorProps>(), {
  showOps: false,
  showRange: false
});

const store = useWorksheetStore();

onMounted(() => {
  // 进入页面时按模板重置，避免沿用上一次模板残留配置。
  store.resetByTemplate(props.template);
});

/**
 * 生成按钮事件：
 * 1) 合并左侧输入
 * 2) 触发 store 校验与生成
 */
function onGenerate(nextConfig: sheetConfig): void {
  store.applyConfig(nextConfig);
  store.generate();
}

/**
 * 打印入口：
 * 仅在有数据时触发浏览器原生打印。
 * 打印范围由 CSS 的 @media print 规则约束为右侧预览内容。
 */
function onPrint(): void {
  if (!store.hasData) {
    return;
  }

  window.print();
}
</script>
