//% weight=100 color=#0099ff icon="\uf1eb" block="IRM-3636T"
namespace IRM_3636T {
    let irPin: DigitalPin;
    let callback: (code: number) => void;

    /**
     * Khởi tạo IRM-3636T trên chân digital
     * @param pin chân OUT nối vào micro:bit, ví dụ DigitalPin.P0
     */
    //% blockId="irm_3636t_init"
    //% block="init IRM-3636T at pin %pin"
    export function init(pin: DigitalPin): void {
        irPin = pin;
        control.inBackground(function () {
            while (true) {
                let code = readNEC()
                if (code != -1 && callback) {
                    callback(code)
                }
            }
        });
    }

    /**
     * Gọi hàm khi nhận được mã IR (NEC)
     * @param cb hàm callback, trả về mã nguyên 32-bit
     */
    //% blockId="irm_3636t_on_receive"
    //% block="on IR code received"
    export function onCodeReceived(cb: (code: number) => void): void {
        callback = cb;
    }

    // Đọc tín hiệu NEC từ cảm biến IR
    function readNEC(): number {
        // Chờ leader pulse ~9ms LOW
        if (pins.pulseIn(irPin, PulseValue.Low, 100000) < 8000) return -1;
        // Chờ leader space ~4.5ms HIGH
        if (pins.pulseIn(irPin, PulseValue.High, 100000) < 4000) return -1;

        let data = 0;
        for (let i = 0; i < 32; i++) {
            let lowTime = pins.pulseIn(irPin, PulseValue.Low, 100000);
            let highTime = pins.pulseIn(irPin, PulseValue.High, 100000);
            if (highTime > 1000) {
                // Bit '1'
                data = (data << 1) | 1;
            } else {
                // Bit '0'
                data = (data << 1);
            }
        }
        return data;
    }
}
