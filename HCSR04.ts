/**
 * HC-SR04 ultrasonic distance sensor for micro:bit (MakeCode)
 * Works with 3-wire trigger/echo or 4-wire modules.
 * NOTE: micro:bit GPIOs are 3.3V tolerant. The HC‑SR04 ECHO pin outputs 5V.
 *       Use a voltage divider (e.g., 1k + 2k) or a safe level shifter on ECHO.
 */
//% weight=100 color=#0fbc11 icon="\uf2a2" block="HC‑SR04"
//% groups='["Measure"]'
namespace HC_SR04 {
    /**
     * Units for distance.
     */
    export enum Unit {
        //% block="cm"
        Centimeters = 0,
        //% block="inch"
        Inches = 1,
        //% block="µs (echo high)"
        MicroSeconds = 2
    }

    /**
     * Measure distance once.
     * The function triggers the sensor, waits for the echo pulse and converts it.
     * @param trig the digital pin connected to TRIG, eg: DigitalPin.P1
     * @param echo the digital pin connected to ECHO (level-shifted!), eg: DigitalPin.P2
     * @param unit the desired output unit, eg: HC_SR04.Unit.Centimeters
     * @param maxDistanceCm cap measurement to reduce blocking time, eg: 400
     */
    //% blockId="hc_sr04_distance"
    //% block="distance (HC‑SR04) trig %trig echo %echo unit %unit||max %maxDistanceCm|cm"
    //% trig.defl=DigitalPin.P1 echo.defl=DigitalPin.P2 unit.defl=HC_SR04.Unit.Centimeters maxDistanceCm.defl=400
    //% weight=100 help=github:distance
    //% group="Measure"
    export function distance(trig: DigitalPin, echo: DigitalPin, unit: Unit = Unit.Centimeters, maxDistanceCm: number = 400): number {
        // Ensure pins are in a known state
        pins.setPull(echo, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);

        // 10 µs trigger pulse
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // Wait for echo: pulseIn returns the duration ECHO stayed high (µs),
        // or 0 on timeout. Use ~58 µs per centimeter (round trip).
        const maxEchoUs = maxDistanceCm * 58; // typical datasheet conversion
        const pulse = pins.pulseIn(echo, PulseValue.High, maxEchoUs);

        if (pulse <= 0) {
            // Timeout or invalid reading
            return -1;
        }

        switch (unit) {
            case Unit.MicroSeconds: return pulse;
            case Unit.Inches: return Math.idiv(pulse, 148); // ~148 µs per inch
            default: return Math.idiv(pulse, 58); // cm
        }
    }

    /**
     * Measure distance multiple times and return the median (robust against outliers).
     * @param trig TRIG pin, eg: DigitalPin.P1
     * @param echo ECHO pin (level-shifted), eg: DigitalPin.P2
     * @param samples number of samples to take (3–9 recommended), eg: 5
     * @param spacingMs delay between samples to let echoes dissipate, eg: 50
     * @param unit output unit, eg: HC_SR04.Unit.Centimeters
     */
    //% blockId="hc_sr04_distance_median"
    //% block="distance median (HC‑SR04) trig %trig echo %echo samples %samples spacing %spacingMs|ms unit %unit"
    //% trig.defl=DigitalPin.P1 echo.defl=DigitalPin.P2 samples.min=1 samples.max=9 samples.defl=5 spacingMs.defl=50 unit.defl=HC_SR04.Unit.Centimeters
    //% weight=90
    //% group="Measure"
    export function distanceMedian(
        trig: DigitalPin,
        echo: DigitalPin,
        samples: number = 5,
        spacingMs: number = 50,
        unit: Unit = Unit.Centimeters
    ): number {
        if (samples <= 1) {
            return distance(trig, echo, unit);
        }
        const arr: number[] = [];
        for (let i = 0; i < samples; i++) {
            const d = distance(trig, echo, Unit.MicroSeconds);
            if (d > 0) arr.push(d);
            basic.pause(spacingMs);
        }
        if (arr.length == 0) return -1;

        // Sort and take median
        arr.sort((a, b) => a - b);
        const mid = arr.length >> 1;
        const us = (arr.length % 2 == 0) ? Math.idiv(arr[mid - 1] + arr[mid], 2) : arr[mid];

        switch (unit) {
            case Unit.MicroSeconds: return us;
            case Unit.Inches: return Math.idiv(us, 148);
            default: return Math.idiv(us, 58);
        }
    }
}
