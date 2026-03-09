#!/bin/bash

# 重庆两江新区天气监控脚本
# 检查未来2-3小时是否有雨，有雨则发送提醒

LOG_FILE="$HOME/.openclaw/workspace/logs/weather-reminder.log"
mkdir -p "$(dirname "$LOG_FILE")"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "开始检查天气..."

# 获取重庆天气数据（使用 wttr.in API）
# %c = 天气图标, %C = 天气描述, %p = 降水概率
WEATHER_INFO=$(curl -s "wttr.in/Chongqing?format=%c+%C+%p" 2>/dev/null)
PRECIP_PROB=$(curl -s "wttr.in/Chongqing?format=%p" 2>/dev/null | tr -d '%\n' | grep -o '[0-9]*' | head -1)

log "天气信息：$WEATHER_INFO, 降水概率：${PRECIP_PROB}%"

# 默认不发送
SEND_REMINDER=false
REMINDER_MSG=""

# 检查降水概率是否大于 50%
if [[ -n "$PRECIP_PROB" && "$PRECIP_PROB" -gt 50 ]]; then
    SEND_REMINDER=true
    REMINDER_MSG="🌧️ 重庆两江新区预计有雨！降水概率：${PRECIP_PROB}%\n主人记得带伞哦～ ☔"
fi

# 检查天气描述是否包含雨
if echo "$WEATHER_INFO" | grep -qi "rain\|雨"; then
    SEND_REMINDER=true
    if [[ -z "$REMINDER_MSG" ]]; then
        REMINDER_MSG="🌧️ 重庆两江新区预计有雨！\n主人记得带伞哦～ ☔"
    fi
fi

if [[ "$SEND_REMINDER" == true ]]; then
    log "发送提醒：$REMINDER_MSG"
    
    # 发送 macOS 系统通知
    osascript -e "display notification \"$REMINDER_MSG\" with title \"暴富天气提醒\""
    
    # 尝试通过 OpenClaw 发送消息（如果可用）
    # 使用 openclaw agent 发送消息到 qqbot
    cd "$HOME/.openclaw/workspace"
    openclaw agent --message "🌧️ 主人，重庆两江新区预计有雨！降水概率：${PRECIP_PROB}%\n\n记得带伞哦～ ☔" 2>/dev/null || true
    
    log "提醒已发送"
    exit 0
else
    log "天气良好，无需提醒"
    exit 1
fi
