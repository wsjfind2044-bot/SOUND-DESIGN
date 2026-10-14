{
  "patcher": {
    "fileversion": 1,
    "appversion": {
      "major": 9,
      "minor": 1,
      "revision": 0,
      "architecture": "x64",
      "modernui": 1
    },
    "classnamespace": "box",
    "rect": [
      0,
      0,
      1100,
      750
    ],
    "boxes": [
      {
        "box": {
          "id": "osc",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            30,
            60,
            70,
            22
          ],
          "text": "cycle~ 220"
        }
      },
      {
        "box": {
          "id": "gain",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            30,
            100,
            70,
            22
          ],
          "text": "*~ 0.05"
        }
      },
      {
        "box": {
          "id": "dac",
          "maxclass": "ezdac~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            30,
            150,
            70,
            22
          ]
        }
      },
      {
        "box": {
          "id": "scope",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            30,
            220,
            180,
            120
          ]
        }
      },
      {
        "box": {
          "id": "fft",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            250,
            100,
            154,
            22
          ],
          "text": "pfft~ pfft_pipe 1024 4"
        }
      },
      {
        "box": {
          "id": "buffer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            250,
            160,
            154,
            22
          ],
          "text": "buffer~ fft_magnitudes"
        }
      },
      {
        "box": {
          "id": "allocate",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            250,
            200,
            168,
            22
          ],
          "text": "loadmess sizeinsamps 512"
        }
      },
      {
        "box": {
          "id": "clock",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            250,
            290,
            70,
            22
          ],
          "text": "qmetro 50"
        }
      },
      {
        "box": {
          "id": "run",
          "maxclass": "toggle",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            250,
            250,
            70,
            22
          ]
        }
      },
      {
        "box": {
          "id": "spectrum",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            250,
            340,
            119,
            22
          ],
          "text": "js spectrogram.js"
        }
      },
      {
        "box": {
          "id": "bars",
          "maxclass": "multislider",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            500,
            340,
            120,
            200
          ],
          "size": 512,
          "setminmax": [
            0.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "peaks",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            250,
            400,
            112,
            22
          ],
          "text": "js peakfinder.js"
        }
      },
      {
        "box": {
          "id": "draw",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            250,
            440,
            105,
            22
          ],
          "text": "js drawpeaks.js"
        }
      },
      {
        "box": {
          "id": "lcd",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            250,
            490,
            154,
            22
          ],
          "text": "jit.lcd 4 char 512 256"
        }
      },
      {
        "box": {
          "id": "peakview",
          "maxclass": "jit.pwindow",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            250,
            540,
            400,
            200
          ]
        }
      },
      {
        "box": {
          "id": "spectroview",
          "maxclass": "jit.pwindow",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            650,
            340,
            400,
            200
          ]
        }
      },
      {
        "box": {
          "id": "freq",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            30,
            25,
            70,
            22
          ]
        }
      },
      {
        "box": {
          "id": "help",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            30,
            690,
            539,
            22
          ],
          "text": "Click speaker to enable DSP; toggle starts visuals. Frequency input is in Hz."
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "freq",
            0
          ],
          "destination": [
            "osc",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "osc",
            0
          ],
          "destination": [
            "gain",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "dac",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "dac",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "scope",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "fft",
            0
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "allocate",
            0
          ],
          "destination": [
            "buffer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "run",
            0
          ],
          "destination": [
            "clock",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clock",
            0
          ],
          "destination": [
            "spectrum",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "spectrum",
            0
          ],
          "destination": [
            "spectroview",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "spectrum",
            1
          ],
          "destination": [
            "bars",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "spectrum",
            1
          ],
          "destination": [
            "peaks",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "peaks",
            1
          ],
          "destination": [
            "draw",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "peaks",
            0
          ],
          "destination": [
            "draw",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "draw",
            0
          ],
          "destination": [
            "lcd",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "lcd",
            0
          ],
          "destination": [
            "peakview",
            0
          ]
        }
      }
    ]
  }
}
