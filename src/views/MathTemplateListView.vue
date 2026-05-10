<template>
  <div class="list-page">
    <header class="list-head">
      <h1>数学打印模板</h1>
      <p>选择模板后进入制作页，支持多页生成与一键打印。</p>
    </header>

    <section class="card-grid">
      <article class="tpl-card" v-for="item in cardList" :key="item.path">
        <h2>{{ item.title }}</h2>
        <p>{{ item.desc }}</p>
        <button class="primary-btn" type="button" @click="jump(item.path)">开始制作</button>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

/**
 * 模板卡片结构。
 * path 对应 router 中已注册的路由地址。
 */
interface cardItem {
  title: string;
  desc: string;
  path: string;
}

const router = useRouter();

/**
 * 列表页仅负责导航，不承载题目生成逻辑。
 * 便于后续扩展更多模板类别（语文/英语）时保持职责单一。
 */
const cardList: cardItem[] = [
  {
    title: "AI生成计算题",
    desc: "按规则随机生成加减法题目，可一次生成多页。",
    path: "/math/ai-calc"
  },
  {
    title: "凑十法",
    desc: "生成凑十拆分练习，适合低年级口算训练。",
    path: "/math/make-ten"
  },
  {
    title: "破十法",
    desc: "生成跨十减法拆分练习，强化借位思路。",
    path: "/math/break-ten"
  }
];

/**
 * 跳转到具体模板制作页。
 */
function jump(path: string): void {
  router.push(path);
}
</script>
