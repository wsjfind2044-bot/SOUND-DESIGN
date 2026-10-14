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
          "id": "input",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            30,
            30,
            70,
            22
          ],
          "text": "fftin~ 1"
        }
      },
      {
        "box": {
          "id": "polar",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            30,
            90,
            70,
            22
          ],
          "text": "cartopol~"
        }
      },
      {
        "box": {
          "id": "write",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 0,
          "patching_rect": [
            30,
            160,
            154,
            22
          ],
          "text": "poke~ fft_magnitudes 1"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "input",
            0
          ],
          "destination": [
            "polar",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "input",
            1
          ],
          "destination": [
            "polar",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "polar",
            0
          ],
          "destination": [
            "write",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "input",
            2
          ],
          "destination": [
            "write",
            1
          ]
        }
      }
    ]
  }
}
