# 项目进度与下次继续的位置

保存日期：2026-10-14（北京时间）。用户暂时暂停项目，先处理其他事情。

## 用户与目标

- 用户是新手，使用 Apple M4 Mac，有可用摄像头。
- 目标：用摄像头识别手部动作，控制 Max 的声音与可视化；先完成单手音高、音量控制，再考虑音色塑形和双手交互。
- 用户已授权将项目修改提交并推送到 GitHub：`wsjfind2044-bot/SOUND-DESIGN`。
- 此聊天的侧边栏文件下载和 ZIP 下载都失败，提示“无法下载构件”。已改为通过 GitHub 下载项目。

## 已完成

- 补齐 `pfft_pipe.maxpat`、`peakfinder.js`、`spectrogram.js`，修正音频/FFT/可视化接线，提供 `SOUND-DESIGN.maxpat`。
- 修复 `drawpeaks.js` 中 `bins` 变量与函数同名的问题，以及单元素数字消息处理。
- 根据用户真实 Max 报错，将不支持的 `setcolor` 改为 `frgb`。用户随后确认：没有报错，能够听到正弦波。
- 新增 `HAND-CONTROL.maxpat`、`gesture-max.js`、`gesture-control.cjs`、`gesture.html`。
- 手势方案：Max 的 Node for Max 启动本机 HTTP 服务；Chrome 本地运行 MediaPipe，将手部参数发送给 Max。无需用户安装 Python 或 npm 包。
- 手上下移动控制 110–880 Hz 音高；拇指与食指距离控制音量；手离开、网页隐藏或数据超时后静音。
- 6 项云端测试通过，包括参数映射、真实本地 HTTP 请求和超时静音。实际摄像头识别、Node for Max 加载及手势音频链路尚未在 Mac 验证。
- MediaPipe 固定版本 0.10.21，JS 与 WASM 的云端请求返回 200。Google 模型下载被云端网络代理拒绝，未验证实际模型加载；这不能证明用户 Mac 也无法下载。

已推送提交：

- `ad1d4f6`：修复 Max 可视化与缺失模块。
- `8383845`：修正 jit.lcd 颜色消息。
- `d8fce40`：新增摄像头手势控制。

## 暂停时的问题

用户按步骤运行手势版后报告：

1. Max Console 出现 `js: drawpeaks: cleared lcd`。
   - 已解释：这是脚本主动打印的清空绘图区提示，不是报错。
2. Chrome 无法访问本地网页，提示网络、VPN 或防火墙相关信息。
   - 根因尚未确定，不能直接归因于 VPN、防火墙或模型下载。
   - 尚未确认 Max Console 是否出现 `Gesture bridge ready: http://127.0.0.1:8765`。
   - 尚未收到任何 Node for Max 错误原文。

## 下次继续

先承接以上问题，不必重新询问芯片、摄像头或重做环境设置。

1. 确认打开的是解压后完整目录中的 `HAND-CONTROL.maxpat`，与 `gesture-max.js`、`gesture-control.cjs` 和 `gesture.html` 同目录。
2. 保持补丁打开，在 Chrome 地址栏输入 `http://127.0.0.1:8765`。使用 HTTP，不是 HTTPS；不要双击 HTML 文件。
3. 请用户确认 Console 是否出现 `Gesture bridge ready: http://127.0.0.1:8765`，并提供包含 `node.script`、`gesture-max`、`Error` 或找不到文件的消息原文；完全没有消息也应记录。
4. 如果没有 ready 消息，先排查 Node for Max 是否启动及文件加载；如果已有 ready 消息，再排查浏览器连接。只有网页能打开后，才排查摄像头权限和模型下载。

用户下一次可以说：“继续 SOUND-DESIGN，查看 SESSION-NOTES.md，排查手势网页打不开。”

## 常用位置与验证

- 云端仓库：`/workspace/SOUND-DESIGN`。
- GitHub：https://github.com/wsjfind2044-bot/SOUND-DESIGN
- 下载：https://github.com/wsjfind2044-bot/SOUND-DESIGN/archive/refs/heads/main.zip
- 回归测试：在仓库目录执行 `node --test tests/*.test.cjs`。
- 桌面操作步骤：`README.md`。
- 环境启动说明已保存为配置草稿，但不能据此断言环境已发布或新任务恢复已验证。

本文件是进度摘要，不是聊天逐字备份。已暂停运行问题的排查，等待用户回来继续。
