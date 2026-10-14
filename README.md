# SOUND-DESIGN

Max/MSP 声音与频谱可视化原型。无需 npm 依赖。

## M4 Mac 摄像头手势控制

1. 下载并解压完整仓库。安装 Chrome，保持联网；首次运行需要从 jsDelivr 和 Google 模型存储下载 MediaPipe 手部识别程序。摄像头图像在浏览器本地处理，Max 只收到手的位置和手指距离。
2. 在 Max 9 打开 `HAND-CONTROL.maxpat`，等待 Console 显示 `Gesture bridge ready: http://127.0.0.1:8765`。使用 Max 自带的 Node for Max，不需要安装 Python、npm 包或终端工具。不要同时打开两份手势补丁，否则会发生端口占用。
3. 用 Chrome 打开 `http://127.0.0.1:8765`，点击“开启摄像头”，允许摄像头访问。若被系统阻止，前往 macOS 系统设置 → 隐私与安全性 → 摄像头，允许 Chrome 使用摄像头。
4. 降低耳机音量，在 Max 点击扬声器开启 DSP，再打开可视化开关。手势补丁默认静音；识别到手才有声音。
5. 将一只手放进画面：上下移动控制 110–880 Hz 音高；拇指食指张开控制音量，捏合静音。音量上限增益为 0.05，控制参数以 50 ms 平滑变化。
6. 手离开画面、网页切到后台、点击“停止并静音”都会静音。控制数据中断超过约半秒时桥接程序也会静音。结束时关闭 DSP，再关闭补丁。

这是单手音高/音量控制版本，尚未加入音色塑形或双手控制。网页摄像头、MediaPipe 真正识别和 Node for Max 的实际加载需要在 Mac 验证；云端只验证 HTTP 通路、参数映射、超时静音及补丁结构。如果网页模型加载失败，请检查网络能否访问 `cdn.jsdelivr.net` 和 `storage.googleapis.com`。

手势模块回归测试：`node --test tests/*.test.cjs`。

## 在桌面运行

需要支持 Max 9 的 Windows 或 macOS、已安装并可使用的 Max，以及音频输出设备。Linux 云环境不能运行完整 Max 音频与 Jitter 界面。

1. 将整个仓库放在同一目录，用 Max 打开 `SOUND-DESIGN.maxpat`。`Max补丁文稿` 保留相同 JSON，便于查看；运行时使用 `.maxpat` 文件。
2. 确认 Max Console 中没有缺失脚本、对象或补丁的错误。同目录下的 `pfft_pipe.maxpat` 和三个 `.js` 文件是运行依赖。
3. 先降低系统音量，再点击扬声器图标开启 DSP。默认正弦频率为 220 Hz、增益为 0.05；上方数字框可以调整频率。
4. 打开可视化开关。每 50 ms 读取 FFT 缓冲区，显示频谱、峰值和频谱历史。历史按列循环覆盖，频率从下到上递增。
5. 调整频率，确认声音、波形和频谱峰值随之变化；关闭开关停止刷新，关闭扬声器停止音频。

FFT 使用 1024 点、4 倍重叠，通过 `fftin~ 1 → cartopol~ → poke~` 写入 512 个频率 bin。可视化定时读取共享缓冲区；不保证读取时整帧原子一致，不适合作为精密测量工具。频谱幅值采用 Hann 窗的近似归一化。

`peakfinder.js` 输出配对的峰值幅度和索引，先发送幅度。`drawpeaks.js` 支持 `bins N`、`size W H`、`scale S` 和 `clear`。`spectrogram.js` 可接收原始 FFT 幅值列表或通过 bang 读取缓冲区。

## 云端验证

在仓库目录执行：

```sh
node --check drawpeaks.js
node --check peakfinder.js
node --check spectrogram.js
node --test tests/visualization.test.cjs
```

测试验证配置消息、峰值算法、幅值归一化、绘图消息、循环覆盖和补丁依赖及端口接线。Max API 使用模拟对象；通过不代表实际音频或 Jitter 已验证。实际 Max 的加载、FFT 缓冲区及视觉效果仍需按桌面步骤检查。

`visualizer_generator.md` 是早期未接线的设计草图，不是运行入口。`Hardware control Code.md` 是 Arduino 示例，当前主补丁未集成串口控制；硬件联动需要后续开发和真实设备验证。
