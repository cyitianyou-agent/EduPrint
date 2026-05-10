<template>
  <article class="sheet-page" :style="pageStyle">
    <div class="watermark" v-if="config.watermark">{{ config.watermark }}</div>

    <header class="sheet-head">
      <div class="head-cell">{{ config.titleLeft }}</div>
      <div class="head-cell head-center">{{ config.titleCenter }}</div>
      <div class="head-cell head-right">{{ config.titleRight }}</div>
    </header>

    <section class="sheet-grid" :style="gridStyle">
      <div class="question-box" v-for="(item, idx) in page.items" :key="idx">
        <template v-if="template === 'aiCalc'">
          <!-- AI 计算题版式：算式 + 下划线答案位 -->
          <div class="expr-row ai-expr">
            <span>{{ item.leftNum }}</span>
            <span>{{ item.opSign }}</span>
            <span>{{ item.rightNum }}</span>
            <span>=</span>
            <span class="answer-line">{{ config.showAnswer ? item.answer : "" }}</span>
          </div>
        </template>

        <template v-else>
          <!--
            凑十/破十共用主骨架：
            - 上方算式
            - 下方分拆图（几何方向由 CSS 的 method-make / method-break 区分）
          -->
          <div class="method-top expr-row">
            <span class="num-cell num-left">{{ item.leftNum }}</span>
            <span class="op-cell">{{ item.opSign }}</span>
            <span class="num-cell num-right">{{ item.rightNum }}</span>
            <span class="eq-cell">=</span>
            <span class="answer-cell">{{ config.showAnswer ? item.answer : "" }}</span>
          </div>

          <div class="method-body" :class="template === 'makeTen' ? 'method-make' : 'method-break'">
            <div class="branch-slash">
              <span class="slash-line slash-left"></span>
              <span class="slash-line slash-right"></span>
            </div>
            <div class="branch-top">
              <span class="small-box split-a">{{ config.showAnswer ? (item.hintA ?? "") : "" }}</span>
              <span class="small-box split-b">{{ config.showAnswer ? (item.hintB ?? "") : "" }}</span>
            </div>
            <div class="branch-main">
              <div class="branch-line"></div>
              <div class="branch-up"></div>
              <span class="small-box bottom-box">{{ config.showAnswer ? (item.hintC ?? "") : "" }}</span>
            </div>
          </div>
        </template>
      </div>
    </section>

    <footer class="sheet-foot">
      <span>{{ config.footLeft }}</span>
      <span>{{ config.footRight || `第 ${page.pageNo} 页` }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { pageData, sheetConfig, templateKind } from "../types/worksheet";

interface pageProps {
  page: pageData;
  config: sheetConfig;
  template: templateKind;
}

const props = defineProps<pageProps>();

/**
 * 每页字号由配置驱动，便于和原型做毫米级微调。
 */
const pageStyle = computed(() => {
  return {
    fontSize: `${props.config.fontSize}px`
  };
});

/**
 * 网格布局参数：
 * - 列数由 colCount 决定
 * - 行间距由 lineGap 决定
 */
const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${props.config.colCount}, minmax(0, 1fr))`,
    rowGap: `${props.config.lineGap}px`
  };
});
</script>
