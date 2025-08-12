//% weight=100 color=#0fbc11 icon="\uf2a2" block="HC-SR04 Multi"
namespace HC_SR04_Multi {
    let trigPin: DigitalPin;
    let echoPins: DigitalPin[] = [];

    /**
     * Khởi tạo nhiều cảm biến HC-SR04 với 1 TRIG chung.
     * @param trig chân TRIG dùng chung, ví dụ DigitalPin.P1
     * @param echos mảng chân ECHO, ví dụ [DigitalPin.P2, DigitalPin.P3]
     */
    //% blockId="hc_sr04_multi_init"
    //% block="init HC-SR04 with trig %trig and echo pins %echos"
    export function init(trig: DigitalPin, echos: DigitalPin[]): void {
        trigPin = trig;
        echoPins = echos;
        pins.setPull(trigPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigPin, 0);
        for (let e of echoPins) {
            pins.setPull(e, PinPullMode.PullNone);
        }
    }

    /**
     * Đo khoảng cách từ cảm biến có chỉ số index (0-based)
     * @param index vị trí cảm biến trong mảng ECHO
     * @param maxDistanceCm khoảng cách tối đa cần đo, mặc định 400 cm
     */
    //% blockId="hc_sr04_multi_distance"
    //% block="distance from sensor %index || max %maxDistanceCm|cm"
    export function distance(index: number, maxDistanceCm: number = 400): number {
        if (index < 0 || index >= echoPins.length) return -1;

        // Đưa TRIG về LOW ít nhất 2 µs
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);

        // Gửi xung TRIG 10 µs
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);

        // Đo độ rộng xung HIGH trên ECHO
        let pulse = pins.pulseIn(echoPins[index], PulseValue.High, maxDistanceCm * 58);
        if (pulse <= 0) return -1; // timeout
        return Math.idiv(pulse, 58); // cm
    }
}
