/**
 * 模板类型：
 * - aiCalc: 通用加减法（规则随机）
 * - makeTen: 凑十法
 * - breakTen: 破十法
 */
export type templateKind = "aiCalc" | "makeTen" | "breakTen";

/**
 * 运算模式：
 * - add: 仅加法
 * - sub: 仅减法
 * - mixed: 加减混合
 * - makeTen: 凑十法
 * - breakTen: 破十法
 */
export type opMode = "add" | "sub" | "mixed" | "makeTen" | "breakTen";

/**
 * 单个模板的可配置项。
 * 说明：该结构同时承载“出题参数”和“打印排版参数”。
 */
export interface sheetConfig {
  // 每页布局：行数 * 列数 = 每页题目总数。
  rowCount: number;
  colCount: number;

  // 一次生成的页数。右侧预览和打印会连续输出这些页。
  pageCount: number;

  // 通用数值范围，仅 aiCalc 使用。
  minValue: number;
  maxValue: number;

  // 由 modeOne/modeTwo 推导得到的实际开关。
  allowAdd: boolean;
  allowSub: boolean;

  // 是否在题目中直接显示答案。
  showAnswer: boolean;

  // 页眉/页脚与水印文字。
  titleLeft: string;
  titleCenter: string;
  titleRight: string;
  footLeft: string;
  footRight: string;
  watermark: string;

  // 版式参数：行间距与题目字号。
  lineGap: number;
  fontSize: number;

  // 原型中的“两组出题方式”输入。
  modeOne: opMode;
  modeTwo: opMode;
}

/**
 * 单道题的数据结构。
 * hintA/hintB/hintC 用于凑十法/破十法的拆分展示。
 */
export interface questionItem {
  leftNum: number;
  rightNum: number;
  opSign: "+" | "-";
  answer: number;
  hintA?: number;
  hintB?: number;
  hintC?: number;
}

/**
 * 单页数据：页号 + 该页所有题目。
 */
export interface pageData {
  pageNo: number;
  items: questionItem[];
}
