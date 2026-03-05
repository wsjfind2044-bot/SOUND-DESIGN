{
  "maxpat": {
    "patcher": {
      "boxes": [
        {
          "box": {
            "id": "serial-connection",
            "maxclass": "serial",
            "numinlets": 1,
            "numoutlets": 1,
            "patching_rect": [50,50,80,20]
          }
        },
        {
          "box": {
            "id": "oscillator",
            "maxclass": "cycle~",
            "numinlets": 2,
            "numoutlets": 1,
            "patching_rect": [150,100,60,20]
          }
        },
        {
          "box": {
            "id": "scope",
            "maxclass": "scope~",
            "numinlets": 1,
            "numoutlets": 1,
            "patching_rect": [250,150,120,80]
          }
        }
      ]
    }
  }
}
