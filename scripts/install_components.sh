#!/usr/bin/env bash
# 批量安装/更新 shadcn-vue 组件（默认按分片批量安装，失败自动拆分回退）
#
# 行为约定：
# 1) 默认/--all：按 COMPONENT_CATALOG 本地清单分片批量安装（更快）。
# 2) --core：仅安装 CORE_COMPONENTS 常用集合。
# 3) 直接传组件名：仅安装传入项（会去重）。
# 4) 对 registry 缺失类错误（404/条目不存在）自动跳过并继续，不中断整体流程。
# 5) 批量失败时自动二分拆分回退，定位异常项并继续可安装项。
# 6) 安装带超时保护，默认 20 秒起（可通过 COMPONENT_TIMEOUT_SEC 覆盖）。
# 7) 对其他错误立即失败并退出，避免静默掩盖真实问题。
#
# 用法：
#   bash scripts/install_components.sh                   # 默认批量安装本地清单中的全部组件
#   bash scripts/install_components.sh --core            # 安装常用组件（当前项目在用）
#   bash scripts/install_components.sh button dialog     # 安装指定组件
#   bash scripts/install_components.sh --dry-run --all   # 仅打印执行计划
#   bash scripts/install_components.sh --serial --all    # 串行逐个安装（兼容旧模式）
#   bash scripts/install_components.sh --list            # 查看组件元信息

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# 结构化组件目录：
# name|中文名|说明|文件数|依赖(逗号分隔)
COMPONENT_CATALOG=(
  "accordion|手风琴|可折叠内容面板|5|reka-ui,@vueuse/core"
  "alert|警告提示|显示重要信息|4|"
  "alert-dialog|警告对话框|需要确认的操作|10|reka-ui,@vueuse/core"
  "aspect-ratio|宽高比容器|保持固定比例|2|reka-ui"
  "avatar|头像|用户图片或占位符|4|reka-ui,@vueuse/core"
  "badge|徽章|状态标签|2|reka-ui,@vueuse/core"
  "breadcrumb|面包屑|导航路径|8|reka-ui"
  "button|按钮|触发操作|2|reka-ui"
  "button-group|按钮组|组合按钮|4|reka-ui,@vueuse/core"
  "calendar|日历|日期选择器|13|reka-ui,@vueuse/core"
  "card|卡片|内容容器|8|"
  "carousel|轮播图|滑动展示|8|embla-carousel-vue,@vueuse/core"
  "chart|图表|数据可视化|6|reka-ui,@vueuse/core"
  "checkbox|复选框|多选控件|2|reka-ui,@vueuse/core"
  "collapsible|折叠面板|展开/收起内容|4|reka-ui"
  "combobox|组合框|可搜索下拉选择|12|reka-ui,@vueuse/core"
  "command|命令面板|快捷命令搜索|10|reka-ui,@vueuse/core"
  "context-menu|右键菜单|上下文操作|16|reka-ui,@vueuse/core"
  "dialog|对话框|模态窗口|11|reka-ui,@vueuse/core"
  "drawer|抽屉|侧边滑出面板|10|vaul-vue,reka-ui,@vueuse/core"
  "dropdown-menu|下拉菜单|点击展开选项|15|reka-ui,@vueuse/core"
  "empty|空状态|无数据占位|7|"
  "field|表单字段|输入项容器|11|"
  "form|表单|数据收集验证|8|vee-validate,zod"
  "hover-card|悬浮卡片|鼠标悬停预览|4|reka-ui,@vueuse/core"
  "input|输入框|文本输入|2|@vueuse/core"
  "input-group|输入框组|带前后缀的输入|7|"
  "input-otp|OTP 输入|验证码输入|5|vue-input-otp,@vueuse/core,reka-ui"
  "item|列表项|通用列表元素|11|reka-ui"
  "kbd|键盘按键|快捷键显示|3|"
  "label|标签|表单标签|2|reka-ui,@vueuse/core"
  "menubar|菜单栏|顶部导航菜单|16|reka-ui,@vueuse/core"
  "native-select|原生选择器|系统下拉框|4|reka-ui,@vueuse/core"
  "navigation-menu|导航菜单|站点导航|9|reka-ui,@vueuse/core"
  "number-field|数字输入|数值输入框|6|reka-ui,@vueuse/core"
  "pagination|分页|数据分页导航|9|reka-ui,@vueuse/core"
  "pin-input|PIN 输入|密码或验证码|5|reka-ui,@vueuse/core"
  "popover|弹出框|浮动内容|5|reka-ui,@vueuse/core"
  "progress|进度条|进度指示|2|reka-ui,@vueuse/core"
  "radio-group|单选组|单选控件|3|reka-ui,@vueuse/core"
  "range-calendar|范围日历|日期范围选择|13|reka-ui,@vueuse/core"
  "resizable|可调整大小|拖拽调整尺寸|4|reka-ui,@vueuse/core"
  "scroll-area|滚动区域|自定义滚动条|3|reka-ui,@vueuse/core"
  "select|选择器|下拉选择|12|reka-ui,@vueuse/core"
  "separator|分隔线|内容分隔|2|reka-ui,@vueuse/core"
  "sheet|侧边栏|滑出面板|10|reka-ui,@vueuse/core"
  "sidebar|侧边导航|应用侧栏|26|reka-ui,@vueuse/core"
  "skeleton|骨架屏|加载占位|2|"
  "slider|滑块|数值滑动选择|2|reka-ui,@vueuse/core"
  "sonner|Toast 通知|消息提示|2|vue-sonner"
  "spinner|加载动画|加载指示器|2|"
  "stepper|步骤条|流程步骤|8|reka-ui,@vueuse/core"
  "switch|开关|切换控件|2|reka-ui,@vueuse/core"
  "table|表格|数据表格|11|@vueuse/core,@tanstack/vue-table"
  "tabs|标签页|内容切换|5|reka-ui,@vueuse/core"
  "tags-input|标签输入|多标签输入|6|reka-ui,@vueuse/core"
  "textarea|文本域|多行文本输入|2|@vueuse/core"
  "toggle|切换按钮|状态切换|2|reka-ui,@vueuse/core"
  "toggle-group|切换按钮组|多选切换|3|reka-ui,@vueuse/core"
  "tooltip|工具提示|悬浮提示|5|reka-ui,@vueuse/core"
)

CORE_COMPONENTS=(
  accordion alert alert-dialog badge breadcrumb button card checkbox command dialog
  dropdown-menu empty input label navigation-menu pagination popover progress
  radio-group scroll-area select separator sheet skeleton slider sonner spinner
  switch table tabs textarea toggle toggle-group tooltip
)

print_usage() {
  cat <<'EOF'
批量安装/更新 shadcn-vue 组件

用法:
  bash scripts/install_components.sh [选项] [组件名...]

选项:
  --all       安装本地清单中的全部组件（默认）
  --core      安装常用组件集合
  --serial    强制串行逐个安装（默认使用批量模式）
  --batch-size N  批量模式每批组件数量（默认读取 COMPONENT_BATCH_SIZE 或 12）
  --list      输出组件目录与依赖信息
  --overwrite 覆盖已存在文件（透传 shadcn-vue add -o）
  --dry-run   仅输出计划，不执行安装
  -h, --help  显示帮助

参数:
  直接传入组件名时，仅安装这些组件（会去重；未知名称交由 CLI 校验）

错误处理:
  - registry 缺失类错误：跳过并继续
  - 其他错误：立即退出并返回非 0

环境变量:
  - COMPONENT_BATCH_SIZE: 批量模式每批组件数量（默认 12）
  - COMPONENT_TIMEOUT_SEC: 安装基础超时秒数（默认 20）
  - COMPONENT_TIMEOUT_STEP_SEC: 批量模式每增加 1 个组件增加的超时秒数（默认 6）
EOF
}

dedupe_components() {
  local -a source=("$@")
  local -a unique=()
  local item
  local seen

  for item in "${source[@]}"; do
    seen=0
    local u
    for u in "${unique[@]}"; do
      if [[ "$u" == "$item" ]]; then
        seen=1
        break
      fi
    done
    if [[ "$seen" -eq 0 ]]; then
      unique+=("$item")
    fi
  done
  printf '%s\n' "${unique[@]}"
}

collect_all_components() {
  local record name _alias _desc _files _deps
  for record in "${COMPONENT_CATALOG[@]}"; do
    IFS='|' read -r name _alias _desc _files _deps <<<"$record"
    printf '%s\n' "$name"
  done
}

get_component_record() {
  local target="$1"
  local record name _alias _desc _files _deps
  for record in "${COMPONENT_CATALOG[@]}"; do
    IFS='|' read -r name _alias _desc _files _deps <<<"$record"
    if [[ "$name" == "$target" ]]; then
      printf '%s\n' "$record"
      return 0
    fi
  done
  return 1
}

is_supported_component() {
  local target="$1"
  get_component_record "$target" >/dev/null 2>&1
}

is_registry_missing_error() {
  local output="$1"
  [[ "$output" == *"was not found"* ]] || [[ "$output" == *"Failed to fetch from registry"* ]]
}

is_positive_integer() {
  local value="$1"
  [[ "$value" =~ ^[1-9][0-9]*$ ]]
}

calc_timeout_for_batch() {
  local batch_size="$1"
  local base_timeout="${COMPONENT_TIMEOUT_SEC:-20}"
  local step_timeout="${COMPONENT_TIMEOUT_STEP_SEC:-6}"

  if ! is_positive_integer "$base_timeout"; then
    echo "❌ COMPONENT_TIMEOUT_SEC 必须是正整数，当前值: $base_timeout"
    exit 1
  fi
  if ! is_positive_integer "$step_timeout"; then
    echo "❌ COMPONENT_TIMEOUT_STEP_SEC 必须是正整数，当前值: $step_timeout"
    exit 1
  fi

  local extra_count=$((batch_size - 1))
  if [[ "$extra_count" -lt 0 ]]; then
    extra_count=0
  fi
  echo $((base_timeout + extra_count * step_timeout))
}

extract_missing_components_from_output() {
  local output="$1"
  local line
  local -a candidates=()

  while IFS= read -r line; do
    if [[ "$line" =~ /r/styles/[^/]+/([a-z0-9-]+)\.json ]]; then
      candidates+=("${BASH_REMATCH[1]}")
    fi
  done <<<"$output"

  if [[ ${#candidates[@]} -eq 0 ]]; then
    return 0
  fi
  dedupe_components "${candidates[@]}"
}

contains_component() {
  local target="$1"
  shift
  local item
  for item in "$@"; do
    if [[ "$item" == "$target" ]]; then
      return 0
    fi
  done
  return 1
}

component_position() {
  local target="$1"
  local idx=0
  local item

  for item in "${COMPONENTS[@]:-}"; do
    idx=$((idx + 1))
    if [[ "$item" == "$target" ]]; then
      printf '%s\n' "$idx"
      return 0
    fi
  done

  printf '0\n'
  return 1
}

log_component_status() {
  local status="$1"
  local component="$2"
  local pos total

  pos="$(component_position "$component" 2>/dev/null || printf '0\n')"
  total="${TOTAL_COMPONENTS:-0}"

  if [[ "$pos" =~ ^[0-9]+$ ]] && [[ "$total" =~ ^[0-9]+$ ]] && [[ "$pos" -gt 0 ]] && [[ "$total" -gt 0 ]]; then
    echo "[$pos/$total] $status: $component"
  else
    echo "$status: $component"
  fi
}

run_cmd_with_timeout() {
  local timeout_sec="$1"
  shift

  local output_file timeout_file
  output_file="$(mktemp)"
  timeout_file="$(mktemp)"

  # 强制非交互：透传日志到终端并保留输出，stdin 置空防止意外卡在交互提示。
  "$@" < /dev/null > >(tee "$output_file") 2>&1 &
  local cmd_pid=$!

  (
    sleep "$timeout_sec"
    if kill -0 "$cmd_pid" 2>/dev/null; then
      echo "1" >"$timeout_file"
      kill "$cmd_pid" 2>/dev/null || true
      sleep 1
      kill -9 "$cmd_pid" 2>/dev/null || true
    fi
  ) &
  local timer_pid=$!

  wait "$cmd_pid"
  local rc=$?
  kill "$timer_pid" 2>/dev/null || true

  LAST_CMD_OUTPUT="$(cat "$output_file")"
  LAST_CMD_TIMED_OUT=0
  if [[ -s "$timeout_file" ]]; then
    LAST_CMD_TIMED_OUT=1
    rc=124
  fi

  rm -f "$output_file" "$timeout_file"
  return "$rc"
}

install_one_component() {
  local component="$1"
  local -a cmd=(env CI=1 "${SHADCN_CLI_CMD[@]}" add -y)
  local timeout_sec
  timeout_sec="$(calc_timeout_for_batch 1)"
  local output

  if [[ "$OVERWRITE" -eq 1 ]]; then
    cmd+=(-o)
  fi
  cmd+=("$component")

  if run_cmd_with_timeout "$timeout_sec" "${cmd[@]}"; then
    log_component_status "✅ 已完成" "$component"
    return 0
  fi

  output="$LAST_CMD_OUTPUT"
  if [[ "${LAST_CMD_TIMED_OUT:-0}" -eq 1 ]]; then
    log_component_status "⚠️ 超时跳过(${timeout_sec}s)" "$component"
    return 2
  fi

  if is_registry_missing_error "$output"; then
    log_component_status "⚠️ 跳过缺失条目" "$component"
    echo "$output" | sed -n '1,8p'
    return 2
  fi

  log_component_status "❌ 安装失败" "$component"
  echo "$output"
  return 1
}

install_component_chunk() {
  local -a chunk=("$@")
  local -a cmd=(env CI=1 "${SHADCN_CLI_CMD[@]}" add -y)
  local chunk_size="${#chunk[@]}"
  local timeout_sec
  local output
  local -a missing_components=()
  local -a remaining_components=()
  local item

  if [[ "$chunk_size" -eq 0 ]]; then
    return 0
  fi

  if [[ "$OVERWRITE" -eq 1 ]]; then
    cmd+=(-o)
  fi
  cmd+=("${chunk[@]}")

  timeout_sec="$(calc_timeout_for_batch "$chunk_size")"
  if run_cmd_with_timeout "$timeout_sec" "${cmd[@]}"; then
    for item in "${chunk[@]}"; do
      log_component_status "✅ 已完成(批次)" "$item"
    done
    SUCCESS_COMPONENTS+=("${chunk[@]}")
    return 0
  fi

  output="$LAST_CMD_OUTPUT"

  if is_registry_missing_error "$output"; then
    mapfile -t missing_components < <(extract_missing_components_from_output "$output")
    if [[ ${#missing_components[@]} -gt 0 ]]; then
      for item in "${chunk[@]}"; do
        if contains_component "$item" "${missing_components[@]}"; then
          log_component_status "⚠️ 跳过缺失条目" "$item"
          SKIPPED_COMPONENTS+=("$item")
        else
          remaining_components+=("$item")
        fi
      done

      if [[ ${#remaining_components[@]} -eq 0 ]]; then
        return 0
      fi
      install_component_chunk "${remaining_components[@]}"
      return $?
    fi
  fi

  if [[ "$chunk_size" -gt 1 ]]; then
    local left_size=$(((chunk_size + 1) / 2))
    local -a left_chunk=("${chunk[@]:0:left_size}")
    local -a right_chunk=("${chunk[@]:left_size}")

    echo "⚠️ 批量安装失败，自动拆分: ${chunk_size} -> ${#left_chunk[@]} + ${#right_chunk[@]}"
    if [[ "${LAST_CMD_TIMED_OUT:-0}" -eq 1 ]]; then
      echo "提示: 当前批次超时(${timeout_sec}s)，拆分后重试。"
    fi
    install_component_chunk "${left_chunk[@]}" || return 1
    install_component_chunk "${right_chunk[@]}" || return 1
    return 0
  fi

  if [[ "${LAST_CMD_TIMED_OUT:-0}" -eq 1 ]]; then
    log_component_status "⚠️ 超时跳过(${timeout_sec}s)" "${chunk[0]}"
    SKIPPED_COMPONENTS+=("${chunk[0]}")
    return 0
  fi

  if is_registry_missing_error "$output"; then
    log_component_status "⚠️ 跳过缺失条目" "${chunk[0]}"
    echo "$output" | sed -n '1,8p'
    SKIPPED_COMPONENTS+=("${chunk[0]}")
    return 0
  fi

  log_component_status "❌ 安装失败" "${chunk[0]}"
  echo "$output"
  return 1
}

print_component_catalog() {
  local record name alias desc files deps
  printf '%-18s %-10s %-6s %s\n' "组件" "中文名" "文件数" "依赖"
  printf '%-18s %-10s %-6s %s\n' "------------------" "----------" "------" "------------------------------"
  for record in "${COMPONENT_CATALOG[@]}"; do
    IFS='|' read -r name alias desc files deps <<<"$record"
    if [[ -z "$deps" ]]; then
      deps="-"
    fi
    printf '%-18s %-10s %-6s %s\n' "$name" "$alias" "$files" "$deps"
  done
}

resolve_target_dir() {
  local -a candidates=()
  if [[ -n "${CLIENT_DIR:-}" ]]; then
    candidates+=("${CLIENT_DIR}")
  fi
  candidates+=("$PWD" "$ROOT_DIR" "$ROOT_DIR/packages/client")

  local dir
  for dir in "${candidates[@]}"; do
    if [[ -f "${dir}/package.json" && -f "${dir}/components.json" ]]; then
      printf '%s\n' "$dir"
      return 0
    fi
  done
  return 1
}

init_shadcn_cli() {
  if pnpm exec shadcn-vue --help >/dev/null 2>&1; then
    SHADCN_CLI_CMD=(pnpm exec shadcn-vue)
  else
    SHADCN_CLI_CMD=(pnpm dlx shadcn-vue@latest)
  fi
}

preflight_registry() {
  local style
  style="$(node -e "const fs=require('fs');const c=JSON.parse(fs.readFileSync('components.json','utf8'));process.stdout.write(c.style||'new-york')")"
  local url="https://shadcn-vue.com/r/styles/${style}/button.json"
  curl -fsS --connect-timeout 3 --max-time 8 -o /dev/null "$url"
}

MODE="all"
LIST_ONLY=0
DRY_RUN=0
OVERWRITE=0
INSTALL_STRATEGY="batch"
COMPONENT_BATCH_SIZE="${COMPONENT_BATCH_SIZE:-12}"
CUSTOM_COMPONENTS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)
      MODE="all"
      shift
      ;;
    --core)
      MODE="core"
      shift
      ;;
    --serial)
      INSTALL_STRATEGY="serial"
      shift
      ;;
    --batch-size)
      if [[ $# -lt 2 ]]; then
        echo "❌ --batch-size 需要一个正整数参数"
        exit 1
      fi
      COMPONENT_BATCH_SIZE="$2"
      shift 2
      ;;
    --list)
      LIST_ONLY=1
      shift
      ;;
    --overwrite)
      OVERWRITE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      CUSTOM_COMPONENTS+=("$1")
      shift
      ;;
  esac
done

mapfile -t ALL_COMPONENTS < <(collect_all_components)

if [[ "$LIST_ONLY" -eq 1 ]]; then
  print_component_catalog
  echo
  echo "组件总数: ${#ALL_COMPONENTS[@]}"
  exit 0
fi

if ! TARGET_DIR="$(resolve_target_dir)"; then
  echo "❌ 未找到可用项目目录（需同时存在 package.json 与 components.json）"
  echo "可通过 CLIENT_DIR 指定目标目录，例如："
  echo "CLIENT_DIR=/path/to/project bash scripts/install_components.sh --all"
  exit 1
fi

cd "$TARGET_DIR"
init_shadcn_cli

if [[ ${#CUSTOM_COMPONENTS[@]} -gt 0 ]]; then
  COMPONENTS=("${CUSTOM_COMPONENTS[@]}")
elif [[ "$MODE" == "core" ]]; then
  COMPONENTS=("${CORE_COMPONENTS[@]}")
else
  COMPONENTS=("${ALL_COMPONENTS[@]}")
fi

if [[ ${#COMPONENTS[@]} -gt 0 ]]; then
  mapfile -t COMPONENTS < <(dedupe_components "${COMPONENTS[@]}")
fi

echo "工作目录: $TARGET_DIR"
echo "安装模式: $MODE"
echo "安装策略: $INSTALL_STRATEGY"
echo "组件数量: ${#COMPONENTS[@]}"
echo "组件列表: ${COMPONENTS[*]}"

if [[ "$INSTALL_STRATEGY" != "serial" ]]; then
  if ! is_positive_integer "$COMPONENT_BATCH_SIZE"; then
    echo "❌ COMPONENT_BATCH_SIZE 必须是正整数，当前值: $COMPONENT_BATCH_SIZE"
    exit 1
  fi
  echo "批量大小: $COMPONENT_BATCH_SIZE"
fi

UNKNOWN_COMPONENTS=()
for comp in "${COMPONENTS[@]}"; do
  if ! is_supported_component "$comp"; then
    UNKNOWN_COMPONENTS+=("$comp")
  fi
done
if [[ ${#UNKNOWN_COMPONENTS[@]} -gt 0 ]]; then
  echo "⚠️ 目录中未记录的组件名: ${UNKNOWN_COMPONENTS[*]}"
  echo "将继续执行，由 shadcn-vue CLI 进行最终校验。"
fi

if [[ "$DRY_RUN" -eq 1 ]]; then
  local_cmd_prefix="env CI=1 ${SHADCN_CLI_CMD[*]} add -y"
  if [[ "$OVERWRITE" -eq 1 ]]; then
    local_cmd_prefix="$local_cmd_prefix -o"
  fi
  if [[ "$INSTALL_STRATEGY" == "serial" ]]; then
    for comp in "${COMPONENTS[@]}"; do
      echo "[dry-run] $local_cmd_prefix $comp"
    done
  else
    total="${#COMPONENTS[@]}"
    start=0
    batch_no=0
    while [[ "$start" -lt "$total" ]]; do
      batch_no=$((batch_no + 1))
      count="$COMPONENT_BATCH_SIZE"
      if [[ $((start + count)) -gt "$total" ]]; then
        count=$((total - start))
      fi
      batch=("${COMPONENTS[@]:start:count}")
      echo "[dry-run][batch-${batch_no}] $local_cmd_prefix ${batch[*]}"
      start=$((start + count))
    done
  fi
  exit 0
fi

if ! preflight_registry; then
  echo "❌ 无法连接 shadcn-vue registry（已快速检测）。"
  echo "请先确认网络后重试，或单独安装指定组件。"
  exit 1
fi

SUCCESS_COMPONENTS=()
SKIPPED_COMPONENTS=()
TOTAL_COMPONENTS=${#COMPONENTS[@]}
if [[ "$INSTALL_STRATEGY" == "serial" ]]; then
  CURRENT_INDEX=0
  for comp in "${COMPONENTS[@]}"; do
    CURRENT_INDEX=$((CURRENT_INDEX + 1))
    echo "[$CURRENT_INDEX/$TOTAL_COMPONENTS] 正在安装: $comp"

    set +e
    install_one_component "$comp"
    rc=$?
    set -e

    if [[ "$rc" -eq 0 ]]; then
      SUCCESS_COMPONENTS+=("$comp")
    elif [[ "$rc" -eq 2 ]]; then
      SKIPPED_COMPONENTS+=("$comp")
    else
      echo "已成功: ${#SUCCESS_COMPONENTS[@]}，已跳过: ${#SKIPPED_COMPONENTS[@]}"
      exit 1
    fi
  done
else
  BATCH_INDEX=0
  START_INDEX=0
  while [[ "$START_INDEX" -lt "$TOTAL_COMPONENTS" ]]; do
    BATCH_INDEX=$((BATCH_INDEX + 1))
    CHUNK_SIZE="$COMPONENT_BATCH_SIZE"
    if [[ $((START_INDEX + CHUNK_SIZE)) -gt "$TOTAL_COMPONENTS" ]]; then
      CHUNK_SIZE=$((TOTAL_COMPONENTS - START_INDEX))
    fi
    CHUNK=("${COMPONENTS[@]:START_INDEX:CHUNK_SIZE}")
    BATCH_END=$((START_INDEX + CHUNK_SIZE))

    echo "[batch $BATCH_INDEX] 执行批次 $((START_INDEX + 1))-$BATCH_END/${TOTAL_COMPONENTS}（共 ${#CHUNK[@]} 个）"
    for comp in "${CHUNK[@]}"; do
      log_component_status "⏳ 待安装" "$comp"
    done

    set +e
    install_component_chunk "${CHUNK[@]}"
    rc=$?
    set -e
    if [[ "$rc" -ne 0 ]]; then
      echo "已成功: ${#SUCCESS_COMPONENTS[@]}，已跳过: ${#SKIPPED_COMPONENTS[@]}"
      exit 1
    fi

    START_INDEX="$BATCH_END"
  done
fi

if [[ ${#SUCCESS_COMPONENTS[@]} -gt 0 ]]; then
  mapfile -t SUCCESS_COMPONENTS < <(dedupe_components "${SUCCESS_COMPONENTS[@]}")
fi
if [[ ${#SKIPPED_COMPONENTS[@]} -gt 0 ]]; then
  mapfile -t SKIPPED_COMPONENTS < <(dedupe_components "${SKIPPED_COMPONENTS[@]}")
fi

echo "安装完成：成功 ${#SUCCESS_COMPONENTS[@]}，跳过 ${#SKIPPED_COMPONENTS[@]}"
if [[ ${#SKIPPED_COMPONENTS[@]} -gt 0 ]]; then
  echo "跳过列表: ${SKIPPED_COMPONENTS[*]}"
fi

echo "✅ shadcn-vue 组件安装完成"
