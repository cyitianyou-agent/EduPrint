import type { pageData, questionItem, sheetConfig, templateKind } from "../types/worksheet";

/**
 * 生成闭区间随机整数。
 * 边界条件：minValue 和 maxValue 应由上层校验保证合法。
 */
function randomInt(minValue: number, maxValue: number): number {
  const value = Math.random() * (maxValue - minValue + 1);
  return Math.floor(value) + minValue;
}

/**
 * 根据配置推断本题符号。
 * 规则优先级：
 * 1) 同时允许加减 -> 随机符号
 * 2) 仅允许减法 -> "-"
 * 3) 其他情况 -> "+"
 */
function pickSign(config: sheetConfig): "+" | "-" {
  if (config.allowAdd && config.allowSub) {
    return Math.random() > 0.5 ? "+" : "-";
  }

  if (config.allowSub) {
    return "-";
  }

  return "+";
}

/**
 * 生成通用计算题（AI生成计算题页）。
 * 注意：减法题会强制 leftNum >= rightNum，避免出现负数结果。
 */
function createAiCalc(config: sheetConfig): questionItem {
  const opSign = pickSign(config);
  let leftNum = randomInt(config.minValue, config.maxValue);
  let rightNum = randomInt(config.minValue, config.maxValue);

  if (opSign === "-" && rightNum > leftNum) {
    const tempNum = leftNum;
    leftNum = rightNum;
    rightNum = tempNum;
  }

  const answer = opSign === "+" ? leftNum + rightNum : leftNum - rightNum;

  return {
    leftNum,
    rightNum,
    opSign,
    answer
  };
}

/**
 * 生成凑十法题目。
 * 目标拆分：left + right = left + need + rest，其中 left + need = 10。
 * 显示约定：
 * - hintA = need
 * - hintB = rest
 * - hintC = 10
 */
function createMakeTen(): questionItem {
  const leftNum = randomInt(1, 9);
  const rightNum = randomInt(1, 9);
  const answer = leftNum + rightNum;
  const needNum = 10 - leftNum;
  const restNum = rightNum - needNum;

  // restNum <= 0 说明无法形成“先凑到10再相加”的标准结构，递归重试。
  if (restNum <= 0) {
    return createMakeTen();
  }

  return {
    leftNum,
    rightNum,
    opSign: "+",
    answer,
    hintA: needNum,
    hintB: restNum,
    hintC: 10
  };
}

/**
 * 生成破十法题目。
 * 目标流程（示例 13-6）：
 * 1) 13 拆成 3 和 10
 * 2) 10 - 6 = 4
 * 3) 3 + 4 = 7
 *
 * 显示约定：
 * - hintA = 左边大数个位
 * - hintB = 10
 * - hintC = 10 - 右边减数
 */
function createBreakTen(): questionItem {
  const leftNum = randomInt(11, 19);
  const rightNum = randomInt(2, 9);

  // 只有当减数大于个位时，才需要真正“破十”。否则会退化成普通减法。
  if (rightNum <= leftNum % 10) {
    return createBreakTen();
  }

  const answer = leftNum - rightNum;
  const firstNum = leftNum % 10;
  const secondNum = 10;
  const thirdNum = 10 - rightNum;

  return {
    leftNum,
    rightNum,
    opSign: "-",
    answer,
    hintA: firstNum,
    hintB: secondNum,
    hintC: thirdNum
  };
}

/**
 * 按模板类型路由到对应出题器。
 */
function createItem(template: templateKind, config: sheetConfig): questionItem {
  if (template === "makeTen") {
    return createMakeTen();
  }

  if (template === "breakTen") {
    return createBreakTen();
  }

  return createAiCalc(config);
}

/**
 * 批量构造多页题目数据。
 * 每页题数 = rowCount * colCount。
 */
export function buildPages(template: templateKind, config: sheetConfig): pageData[] {
  const pageList: pageData[] = [];
  const itemCount = config.rowCount * config.colCount;

  for (let pageNo = 1; pageNo <= config.pageCount; pageNo += 1) {
    const items: questionItem[] = [];

    for (let i = 0; i < itemCount; i += 1) {
      const item = createItem(template, config);
      items.push(item);
    }

    pageList.push({
      pageNo,
      items
    });
  }

  return pageList;
}
