//% weight=100 color=#ff6600 icon="\uf06e" block="TCRT5000"
namespace TCRT5000 {
    /**
     * Đọc giá trị analog từ cảm biến TCRT5000
     * @param pin chân analog nối với OUT của TCRT5000, ví dụ AnalogPin.P0
     * @returns giá trị ADC (0-1023)
     */
    //% blockId="tcrt5000_read_analog"
    //% block="analog value from TCRT5000 at pin %pin"
    export function readAnalog(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    /**
     * Đọc trạng thái digital (nếu module có LM393 comparator)
     * @param pin chân digital nối với OUT của TCRT5000, ví dụ DigitalPin.P0
     * @returns true nếu phát hiện phản xạ mạnh (nền sáng), false nếu phản xạ yếu (nền tối)
     */
    //% blockId="tcrt5000_read_digital"
    //% block="digital state from TCRT5000 at pin %pin"
    export function readDigital(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1;
    }

    /**
     * Kiểm tra có phát hiện vật phản xạ gần hay không
     * @param pin chân analog nối OUT
     * @param threshold ngưỡng so sánh (0-1023), ví dụ 500
     * @returns true nếu giá trị lớn hơn ngưỡng
     */
    //% blockId="tcrt5000_detect"
    //% block="detected object on pin %pin with threshold %threshold"
    export function isDetected(pin: AnalogPin, threshold: number = 500): boolean {
        return pins.analogReadPin(pin) > threshold;
    }
}
