import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { buildPages } from "../composables/generators";
import type { pageData, sheetConfig, templateKind } from "../types/worksheet";

/**
 * 创建默认配置。
 * 说明：该默认值会在每次切换模板时作为“初始快照”复制，再按模板做增量覆盖。
 */
function createDefault(): sheetConfig {
  return {
    rowCount: 6,
    colCount: 4,
    pageCount: 2,
    minValue: 1,
    maxValue: 99,
    allowAdd: true,
    allowSub: true,
    showAnswer: false,
    titleLeft: "改变孩子的习惯，从一张字帖开始！",
    titleCenter: "",
    titleRight: "答对题数____ 姓名____ 班级____ 学号____",
    footLeft: "",
    footRight: "",
    watermark: "",
    lineGap: 42,
    fontSize: 28,
    modeOne: "mixed",
    modeTwo: "mixed"
  };
}

/**
 * 将“出题方式1/2”转换为真实开关 allowAdd/allowSub。
 * 规则：只要任一模式是 mixed，就等价于加减混合。
 */
function applyMode(config: sheetConfig): sheetConfig {
  const hasAdd =
    config.modeOne === "add" ||
    config.modeTwo === "add" ||
    config.modeOne === "makeTen" ||
    config.modeTwo === "makeTen";
  const hasSub =
    config.modeOne === "sub" ||
    config.modeTwo === "sub" ||
    config.modeOne === "breakTen" ||
    config.modeTwo === "breakTen";
  const hasMix = config.modeOne === "mixed" || config.modeTwo === "mixed";

  if (hasMix) {
    config.allowAdd = true;
    config.allowSub = true;
    return config;
  }

  config.allowAdd = hasAdd;
  config.allowSub = hasSub;
  return config;
}

/**
 * 工作表状态仓库：
 * - 保存当前模板配置
 * - 管理生成后的多页题目
 * - 提供表单校验与重置能力
 */
export const useWorksheetStore = defineStore("worksheet", () => {
  const template = ref<templateKind>("aiCalc");
  const config = ref<sheetConfig>(createDefault());
  const pages = ref<pageData[]>([]);
  const notice = ref<string>("");

  // 仅用于 UI 控件可用态，不承担业务判断。
  const hasData = computed(() => pages.value.length > 0);

  /**
   * 局部更新配置。
   * 注意：更新后必须重新走 applyMode，防止 mode 与 allow 标记不一致。
   */
  function applyConfig(partial: Partial<sheetConfig>): void {
    const nextConfig = {
      ...config.value,
      ...partial
    };

    config.value = applyMode(nextConfig);
  }

  /**
   * 生成前校验。
   * 这里只处理“结构性”错误，不处理视觉偏好或高级业务规则。
   */
  function validateConfig(): string {
    if (config.value.rowCount <= 0 || config.value.colCount <= 0) {
      return "行数和列数必须大于 0";
    }

    if (config.value.pageCount <= 0) {
      return "页数必须大于 0";
    }

    if (config.value.minValue > config.value.maxValue) {
      return "最小值不能大于最大值";
    }

    if (!config.value.allowAdd && !config.value.allowSub && template.value === "aiCalc") {
      return "AI生成计算题至少需要一种出题方式";
    }

    return "";
  }

  /**
   * 执行生成流程：
   * 1) 校验
   * 2) 写入提示文案
   * 3) 调用生成器并覆盖 pages
   */
  function generate(): boolean {
    const errText = validateConfig();

    if (errText) {
      notice.value = errText;
      return false;
    }

    if (config.value.pageCount > 30) {
      // 页数过大时仅提示性能风险，不中断生成。
      notice.value = "页数超过 30，预览和打印会变慢，请分批生成。";
    } else {
      notice.value = "题目已生成，可直接打印。";
    }

    pages.value = buildPages(template.value, config.value);
    return true;
  }

  /**
   * 按模板重置配置。
   * 约束：切换模板后必须清空旧 pages，避免跨模板残留数据造成误判。
   */
  function resetByTemplate(nextTemplate: templateKind): void {
    const baseConfig = createDefault();

    if (nextTemplate === "makeTen") {
      baseConfig.allowAdd = true;
      baseConfig.allowSub = false;
      baseConfig.modeOne = "add";
      baseConfig.modeTwo = "add";
      baseConfig.maxValue = 9;
      baseConfig.pageCount = 1;
      baseConfig.fontSize = 30;
      baseConfig.lineGap = 50;
    }

    if (nextTemplate === "breakTen") {
      baseConfig.allowAdd = false;
      baseConfig.allowSub = true;
      baseConfig.modeOne = "sub";
      baseConfig.modeTwo = "sub";
      baseConfig.maxValue = 19;
      baseConfig.pageCount = 1;
      baseConfig.fontSize = 30;
      baseConfig.lineGap = 50;
    }

    template.value = nextTemplate;
    config.value = baseConfig;
    pages.value = [];
    notice.value = "";
  }

  return {
    template,
    config,
    pages,
    notice,
    hasData,
    applyConfig,
    generate,
    resetByTemplate
  };
});
