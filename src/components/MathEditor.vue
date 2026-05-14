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
      :can-print="canPrint"
      @generate="onGenerate"
      @print="onPrint"
    />

    <section class="preview-panel" ref="previewPanelRef">
      <PrintPreview
        v-if="store.hasData"
        class="preview-screen"
        :class="{ 'preview-zoom': useScaledPreview, 'preview-capture': isCaptureMode }"
        :style="previewStyle"
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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
const isBusy = ref<boolean>(false);
const isCaptureMode = ref<boolean>(false);
const isAndroidDevice = ref<boolean>(false);
const previewPanelRef = ref<HTMLElement | null>(null);
const previewScale = ref<number>(1);
const canPrint = computed<boolean>(() => store.hasData && !isBusy.value);
const useScaledPreview = computed<boolean>(() => {
  return isAndroidDevice.value && !isCaptureMode.value && previewScale.value < 1;
});
const previewStyle = computed((): Record<string, string> => {
  if (!useScaledPreview.value) {
    return {};
  }

  return {
    "--preview-scale": previewScale.value.toString()
  };
});

onMounted(() => {
  // 进入页面时按模板重置，避免沿用上一次模板残留配置。
  store.resetByTemplate(props.template);
  const userAgent = navigator.userAgent || "";
  isAndroidDevice.value = /Android/i.test(userAgent);
  updatePreviewScale();
  window.addEventListener("resize", updatePreviewScale);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updatePreviewScale);
});

watch(
  () => store.hasData,
  async () => {
    await nextTick();
    updatePreviewScale();
  }
);

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
 * 计算安卓端预览缩放比例。
 * 约束：
 * - 仅在安卓端启用，桌面端保持现有显示。
 * - 缩放下限 0.42，避免在超窄屏幕下过度缩小导致不可读。
 */
function updatePreviewScale(): void {
  if (!isAndroidDevice.value) {
    previewScale.value = 1;
    return;
  }

  const previewPanel = previewPanelRef.value;

  if (!previewPanel) {
    previewScale.value = 1;
    return;
  }

  const panelWidth = previewPanel.clientWidth;
  const panelStyle = window.getComputedStyle(previewPanel);
  const padLeft = Number.parseFloat(panelStyle.paddingLeft || "0");
  const padRight = Number.parseFloat(panelStyle.paddingRight || "0");
  const contentWidth = panelWidth - padLeft - padRight;
  const safeWidth = contentWidth - 4;
  const a4WidthPx = 794;

  if (safeWidth >= a4WidthPx) {
    previewScale.value = 1;
    return;
  }

  const rawScale = safeWidth / a4WidthPx;
  const nextScale = Math.max(0.42, rawScale);
  previewScale.value = Number(nextScale.toFixed(3));
}

/**
 * 计算截图缩放比例。
 * 约束：
 * - 下限 1：避免低分屏截图过糊。
 * - 上限 2：避免高分屏手机导出时内存占用过高导致失败。
 */
function getScale(): number {
  const pixelRatio = window.devicePixelRatio || 1;

  if (pixelRatio < 1) {
    return 1;
  }

  if (pixelRatio > 2) {
    return 2;
  }

  return pixelRatio;
}

/**
 * 导出多页 PDF。
 * 意图：在安卓端浏览器原生打印不稳定时，提供可落地的导出路径，
 * 用户可在系统查看器中继续打印，避免“点击无反应”。
 */
async function exportPdf(): Promise<boolean> {
  isCaptureMode.value = true;
  await nextTick();

  try {
    const printArea = document.getElementById("printArea");

    if (!printArea) {
      store.setNotice("未找到打印区域，请先生成题目后重试。");
      return false;
    }

    const pageList = Array.from(printArea.querySelectorAll<HTMLElement>(".sheet-page"));

    if (pageList.length === 0) {
      store.setNotice("没有可导出的页面，请先生成题目。");
      return false;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf")
    ]);
    const fontSet = (document as Document & {
      fonts?: {
        ready: Promise<unknown>;
      };
    }).fonts;

    if (fontSet?.ready) {
      await fontSet.ready;
    }

    const pdfDoc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    for (let pageIndex = 0; pageIndex < pageList.length; pageIndex += 1) {
      const pageNode = pageList[pageIndex];
      const pageCanvas = await html2canvas(pageNode, {
        backgroundColor: "#ffffff",
        scale: getScale(),
        useCORS: true
      });
      const imageData = pageCanvas.toDataURL("image/jpeg", 0.95);

      if (pageIndex > 0) {
        pdfDoc.addPage("a4", "portrait");
      }

      pdfDoc.addImage(imageData, "JPEG", 0, 0, 210, 297);
    }

    pdfDoc.save("eduprint-worksheet.pdf");
    store.setNotice("安卓端已导出 PDF，请在系统文件预览中继续打印。");
    return true;
  } catch (err) {
    console.error(err);
    store.setNotice("PDF 导出失败，请稍后重试或改用桌面浏览器打印。");
    return false;
  } finally {
    isCaptureMode.value = false;
    await nextTick();
    updatePreviewScale();
  }
}

/**
 * 打印入口：
 * 仅在有数据时触发浏览器原生打印。
 * 打印范围由 CSS 的 @media print 规则约束为右侧预览内容。
 */
async function onPrint(): Promise<void> {
  if (!store.hasData) {
    return;
  }

  if (isBusy.value) {
    return;
  }

  isBusy.value = true;

  try {
    const userAgent = navigator.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      await exportPdf();
      return;
    }

    window.print();
    store.setNotice("已调用系统打印，请在系统弹窗中完成打印。");
  } catch (err) {
    console.error(err);
    store.setNotice("打印失败，请稍后重试。");
  } finally {
    isBusy.value = false;
  }
}
</script>
