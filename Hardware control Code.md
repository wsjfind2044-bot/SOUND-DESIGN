// 读取旋钮，映射到音量、音高、滤波器参数
const int knob1 = A0; // 音高旋钮
const int knob2 = A1; // 滤波器旋钮
const int knob3 = A2; // 音量旋钮

const int LED_R = 3;  // RGB LED 红
const int LED_G = 5;  // RGB LED 绿
const int LED_B = 6;  // RGB LED 蓝

int pitchValue = 0;
int filterValue = 0;
int volumeValue = 0;

void setup() {
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  Serial.begin(9600); // 通过串口与 Max 进行交互
}

void loop() {
  // 读取旋钮的值
  pitchValue = analogRead(knob1); // 读取音高
  filterValue = analogRead(knob2); // 读取滤波器
  volumeValue = analogRead(knob3); // 读取音量

  // 将旋钮值映射到 0-255，用来控制 RGB LED
  int red = map(pitchValue, 0, 1023, 0, 255);
  int green = map(filterValue, 0, 1023, 0, 255);
  int blue = map(volumeValue, 0, 1023, 0, 255);

  analogWrite(LED_R, red);   // 控制 LED 红
  analogWrite(LED_G, green); // 控制 LED 绿
  analogWrite(LED_B, blue);  // 控制 LED 蓝

  // 将旋钮数据通过串口发送给 Max
  Serial.print(pitchValue);
  Serial.print(",");
  Serial.print(filterValue);
  Serial.print(",");
  Serial.println(volumeValue);

  delay(10);
}
