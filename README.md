# SOUND-DESIGN

Max/MSP 声音与频谱可视化原型。无需 npm 依赖。

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
