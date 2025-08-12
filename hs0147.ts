//% weight=100 icon="\uf185" block="HS0147 Light"
namespace HS0147 {
    /**
     * Đọc giá trị ánh sáng từ cảm biến HS0147 (0–1023)
     * @param pin chân analog nối với OUT của HS0147, ví dụ AnalogPin.P1
     */
    //% blockId="hs0147_read"
    //% block="light value from HS0147 at pin %pin"
    export function readLight(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    /**
     * Kiểm tra ánh sáng vượt ngưỡng
     * @param pin chân analog OUT
     * @param threshold ngưỡng (0–1023)
     * @returns true nếu ánh sáng mạnh hơn ngưỡng
     */
    //% blockId="hs0147_is_bright"
    //% block="is bright on pin %pin with threshold %threshold"
    export function isBright(pin: AnalogPin, threshold: number = 512): boolean {
        return pins.analogReadPin(pin) > threshold;
    }
}
