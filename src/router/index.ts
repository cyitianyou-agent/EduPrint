/**
 * 路由定义：
 * - 仅承载页面导航关系，不放业务状态。
 * - 当前为数学线 MVP，后续可在此并行扩展语文等模块路由。
 */
import { createRouter, createWebHistory } from "vue-router";
import MathTemplateListView from "../views/MathTemplateListView.vue";
import AiCalcView from "../views/templates/AiCalcView.vue";
import MakeTenView from "../views/templates/MakeTenView.vue";
import BreakTenView from "../views/templates/BreakTenView.vue";

export const router = createRouter({
  // 采用 history 模式，URL 更干净。
  // 部署到静态站点时需确保服务端回退到 index.html。
  history: createWebHistory(),
  routes: [
    {
      // 根路径统一导向数学模板列表，避免空白首页。
      path: "/",
      redirect: "/math"
    },
    {
      path: "/math",
      name: "mathList",
      component: MathTemplateListView
    },
    {
      path: "/math/ai-calc",
      name: "aiCalc",
      component: AiCalcView
    },
    {
      path: "/math/make-ten",
      name: "makeTen",
      component: MakeTenView
    },
    {
      path: "/math/break-ten",
      name: "breakTen",
      component: BreakTenView
    }
  ]
});
