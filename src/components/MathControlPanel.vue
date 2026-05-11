<template>
  <section class="side-panel no-print" :class="panelClass">
    <button class="link-btn" type="button" @click="goList">← 返回模板列表</button>
    <h2>{{ title }}</h2>

    <!--
      AI 计算题配置区：
      保留较完整的数值与版式参数，用于生成通用加减法打印页。
    -->
    <template v-if="template === 'aiCalc'">
      <label class="field-item row-grid">
        <span>出题方式1：</span>
        <select v-model="local.modeOne">
          <option value="add">加法</option>
          <option value="sub">减法</option>
          <option value="mixed">混合</option>
          <option value="makeTen">凑十法</option>
          <option value="breakTen">破十法</option>
        </select>
        <span>出题方式2：</span>
        <select v-model="local.modeTwo">
          <option value="add">加法</option>
          <option value="sub">减法</option>
          <option value="mixed">混合</option>
          <option value="makeTen">凑十法</option>
          <option value="breakTen">破十法</option>
        </select>
      </label>

      <label class="field-item row-grid">
        <span>最小值：</span>
        <input type="number" min="0" max="999" v-model.number="local.minValue" />
        <span>最大值：</span>
        <input type="number" min="1" max="999" v-model.number="local.maxValue" />
      </label>

      <label class="field-item row-grid">
        <span>每行题数：</span>
        <input type="number" min="1" max="8" v-model.number="local.colCount" />
        <span>每页行数：</span>
        <input type="number" min="1" max="20" v-model.number="local.rowCount" />
      </label>

      <label class="field-item row-grid">
        <span>生成页数：</span>
        <input type="number" min="1" max="100" v-model.number="local.pageCount" />
        <span>行间距：</span>
        <input type="number" min="18" max="90" v-model.number="local.lineGap" />
      </label>

      <label class="field-item row-grid">
        <span>字体尺寸：</span>
        <input type="number" min="16" max="48" v-model.number="local.fontSize" />
        <span>显示答案：</span>
        <select v-model="showText">
          <option value="false">不显示</option>
          <option value="true">显示</option>
        </select>
      </label>

      <label class="field-item">
        <span>页眉左边：</span>
        <input type="text" v-model="local.titleLeft" />
      </label>

      <label class="field-item">
        <span>页眉中间：</span>
        <input type="text" v-model="local.titleCenter" />
      </label>

      <label class="field-item">
        <span>页眉右边：</span>
        <input type="text" v-model="local.titleRight" />
      </label>

      <label class="field-item">
        <span>页角左边：</span>
        <input type="text" v-model="local.footLeft" />
      </label>

      <label class="field-item">
        <span>页角右边：</span>
        <input type="text" v-model="local.footRight" />
      </label>

      <label class="field-item">
        <span>设置水印：</span>
        <input type="text" v-model="local.watermark" placeholder="如果为空，不显示水印" />
      </label>

      <div class="action-row">
        <button class="primary-btn" type="button" @click="onGenerate">点击生成试题</button>
        <button class="print-btn" type="button" @click="onPrint" :disabled="!canPrint">直接打印</button>
      </div>
    </template>

    <!--
      凑十法/破十法配置区：
      保持接近原型的“种子输入 + 自动出题 + 打印”交互。
    -->
    <template v-else>
      <label class="field-item">
        <textarea class="seed-text" v-model="seedText" placeholder="7+7= 6+9= 2+9= 5+9="></textarea>
      </label>

      <button class="line-btn" type="button" @click="onGenerate">点击生成字帖</button>

      <label class="field-item row-grid small-grid">
        <span>自动出题：</span>
        <select v-model="autoMode">
          <option value="add" v-if="template === 'makeTen'">加法</option>
          <option value="sub" v-if="template === 'breakTen'">减法</option>
          <option value="mixed">混合</option>
        </select>
        <span>显示答案：</span>
        <select v-model="showText">
          <option value="false">不显示</option>
          <option value="true">显示</option>
        </select>
      </label>

      <button class="ai-refresh" type="button" @click="fillSeed">AI题感,点击更新输入框内容</button>

      <label class="field-item row-grid small-grid">
        <span>每行题数：</span>
        <input type="number" min="1" max="8" v-model.number="local.colCount" />
        <span>每页行数：</span>
        <input type="number" min="1" max="20" v-model.number="local.rowCount" />
      </label>

      <label class="field-item row-grid small-grid">
        <span>生成页数：</span>
        <input type="number" min="1" max="100" v-model.number="local.pageCount" />
        <span>行间距：</span>
        <input type="number" min="18" max="90" v-model.number="local.lineGap" />
      </label>

      <label class="field-item">
        <span>页眉左边：</span>
        <input type="text" v-model="local.titleLeft" />
      </label>

      <label class="field-item">
        <span>页眉中间：</span>
        <input type="text" v-model="local.titleCenter" />
      </label>

      <label class="field-item">
        <span>页眉右边：</span>
        <input type="text" v-model="local.titleRight" />
      </label>

      <label class="field-item">
        <span>页角左边：</span>
        <input type="text" v-model="local.footLeft" />
      </label>

      <label class="field-item">
        <span>页角右边：</span>
        <input type="text" v-model="local.footRight" />
      </label>

      <label class="field-item">
        <span>设置水印：</span>
        <input type="text" v-model="local.watermark" placeholder="如果为空,不显示水印" />
      </label>

      <div class="action-row">
        <!-- 该按钮目前复用打印链路，后续如接入 PDF 库可独立实现。 -->
        <button class="print-btn" type="button" @click="onPrint" :disabled="!canPrint">导出高清PDF</button>
        <button class="print-btn" type="button" @click="onPrint" :disabled="!canPrint">直接打印</button>
      </div>
    </template>

    <p class="notice" v-if="notice">{{ notice }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import type { opMode, sheetConfig, templateKind } from "../types/worksheet";

interface panelProps {
  title: string;
  config: sheetConfig;
  template: templateKind;
  showOps: boolean;
  showRange: boolean;
  notice: string;
  canPrint: boolean;
}

const props = defineProps<panelProps>();

const emit = defineEmits<{
  // 将左侧配置快照抛给父组件，父组件再统一交给 store。
  generate: [sheetConfig];
  // 打印由父组件统一处理，保证多个页面行为一致。
  print: [];
}>();

const router = useRouter();

/**
 * local 作为可编辑副本：
 * - 避免直接改 props.config 触发 Vue 只读警告
 * - 用户输入可以先落本地，再一次性 emit 给上层
 */
const local = reactive<sheetConfig>({ ...props.config });

// 原型中的“题目种子输入框”。当前仅用于视觉与输入承载，不直接驱动生成算法。
const seedText = ref<string>("");

watch(
  () => props.config,
  (nextValue) => {
    // 外部配置变更（如切换模板）时，覆盖本地编辑副本。
    Object.assign(local, nextValue);
  },
  {
    deep: true
  }
);

/**
 * 在 UI 层使用字符串值，避免 select 与布尔值的双向绑定歧义。
 */
const showText = computed({
  get() {
    return local.showAnswer ? "true" : "false";
  },
  set(value: string) {
    local.showAnswer = value === "true";
  }
});

/**
 * 自动出题模式映射：
 * - 若 modeOne/modeTwo 一致，则显示该单一值
 * - 否则显示 mixed
 */
const autoMode = computed({
  get() {
    if (local.modeOne === local.modeTwo) {
      return local.modeOne;
    }

    return "mixed";
  },
  set(value: string) {
    const nextMode = value as opMode;
    local.modeOne = nextMode;
    local.modeTwo = nextMode;
  }
});

const panelClass = computed(() => {
  return {
    "ai-panel": props.template === "aiCalc",
    "method-panel": props.template !== "aiCalc"
  };
});

/**
 * 生成演示题串，帮助用户快速填充左侧文本框。
 * 约束：
 * - 凑十法只生成加法外观
 * - 破十法只生成减法外观
 */
function fillSeed(): void {
  const seedList: string[] = [];
  const isAdd = props.template === "makeTen";

  for (let i = 0; i < 18; i += 1) {
    const leftNum = isAdd ? randomInt(1, 9) : randomInt(11, 19);
    const rightNum = isAdd ? randomInt(1, 9) : randomInt(2, 9);
    const opSign = isAdd ? "+" : "-";
    const text = `${leftNum}${opSign}${rightNum}=`;
    seedList.push(text);
  }

  seedText.value = seedList.join("  ");
}

/**
 * 本地随机整数工具，仅供 fillSeed 使用。
 */
function randomInt(minValue: number, maxValue: number): number {
  const value = Math.random() * (maxValue - minValue + 1);
  return Math.floor(value) + minValue;
}

function onGenerate(): void {
  emit("generate", { ...local });
}

function onPrint(): void {
  emit("print");
}

function goList(): void {
  router.push("/math");
}
</script>
