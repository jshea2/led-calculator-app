'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

const analogLEDs = ["RGB", "RGBW", "RGBWW", "WW", "CW"];

const digitalLEDs = [
    "WS2811", "WS2812B", "WS2813", "WS2815",
    "SK6812", "APA102", "TM1814", "UCS1903", "LPD8806",
];

const LEDCalculator = () => {
    const [ledType, setLedType] = useState("RGB");
    const [volts, setVolts] = useState("12");
    const [ppm, setPpm] = useState("60");
    const [length, setLength] = useState("");
    const [unit, setUnit] = useState<"feet" | "meters">("feet");
    const [rollLength, setRollLength] = useState("16.4");
    const [rollUnit, setRollUnit] = useState<"feet" | "meters">("feet");
    const [pixelsPerRoll, setPixelsPerRoll] = useState("300");
    const [costPerRoll, setCostPerRoll] = useState("18");

    const isAnalog = analogLEDs.includes(ledType);

    const wattsPerPixelMap: Record<string, number> = {
        RGB: 0.24,
        RGBW: 0.3,
        RGBWW: 0.3,
        WW: 0.2,
        CW: 0.2,
        WS2812B: 0.3,
        WS2811: 0.3,
        WS2815: 0.3,
        SK6812: 0.3,
        APA102: 0.25,
        TM1814: 0.25,
        UCS1903: 0.25,
        LPD8806: 0.3,
    };

    useEffect(() => {
        const ppmVal = parseFloat(ppm);
        const rollLenVal = parseFloat(rollLength);
        if (ppmVal > 0 && rollLenVal > 0) {
            const rollLengthMeters = rollUnit === "feet" ? rollLenVal / 3.28084 : rollLenVal;
            setPixelsPerRoll(Math.round(ppmVal * rollLengthMeters).toString());
        }
    }, [ppm, rollLength, rollUnit]);

    const parsedLength = parseFloat(length) || 0;
    const lengthMeters = unit === "feet" ? parsedLength / 3.28084 : parsedLength;
    const ppmVal = parseFloat(ppm) || 0;
    const totalPixels = isAnalog ? 0 : Math.round(lengthMeters * ppmVal);
    const totalRollsRaw = parsedLength / (rollUnit === "feet" ? parseFloat(rollLength) : parseFloat(rollLength) * 3.28084);
    const totalRolls = Math.ceil(totalRollsRaw);
    const pricePerRoll = parseFloat(costPerRoll) || 0;
    const totalCost = totalRolls * pricePerRoll;
    const wattsPerPixel = wattsPerPixelMap[ledType] || 0.25;
    const totalWatts = totalPixels * wattsPerPixel;
    const amps = parseFloat(volts) ? totalWatts / parseFloat(volts) : 0;
    const universes = isAnalog ? null : Math.ceil(totalPixels / 510);

    return (
        <div className="grid gap-6 md:grid-cols-2 p-4">
            <div className="space-y-4">
                <div>
                    <label>LED Type</label>
                    <Select value={ledType} onValueChange={setLedType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <div className="px-2 text-xs text-muted-foreground">Analog</div>
                            {analogLEDs.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            <div className="px-2 pt-2 text-xs text-muted-foreground">Digital</div>
                            {digitalLEDs.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label>Volts</label>
                    <Select value={volts} onValueChange={setVolts}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5V</SelectItem>
                            <SelectItem value="12">12V</SelectItem>
                            <SelectItem value="24">24V</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label>Pixels per Meter</label>
                    <Input value={ppm} onChange={e => setPpm(e.target.value)} />
                </div>

                <div>
                    <label>Length</label>
                    <div className="flex gap-2">
                        <Input value={length} onChange={e => setLength(e.target.value)} />
                        <Select value={unit} onValueChange={val => setUnit(val as "feet" | "meters")}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="feet">feet</SelectItem>
                                <SelectItem value="meters">meters</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <label>Roll Length</label>
                    <div className="flex gap-2">
                        <Input value={rollLength} onChange={e => setRollLength(e.target.value)} />
                        <Select value={rollUnit} onValueChange={val => setRollUnit(val as "feet" | "meters")}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="feet">feet</SelectItem>
                                <SelectItem value="meters">meters</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <label>Pixels per Roll</label>
                    <Input value={pixelsPerRoll} onChange={e => setPixelsPerRoll(e.target.value)} />
                </div>

                <div>
                    <label>Cost per Roll ($)</label>
                    <Input value={costPerRoll} onChange={e => setCostPerRoll(e.target.value)} />
                </div>
            </div>

            <div className="md:col-span-1">
                <Card>
                    <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                        <div><strong>Total Pixels:</strong> {totalPixels}</div>
                        <div><strong>Watts per Pixel:</strong> {wattsPerPixel.toFixed(3)} W</div>
                        <div><strong>Total Watts:</strong> {totalWatts.toFixed(2)} W</div>
                        <div><strong>Total Amps:</strong> {amps.toFixed(2)} A</div>
                        <div>
                            <strong>Rolls Needed:</strong> {totalRolls} <span className="text-sm text-muted-foreground">({totalRollsRaw.toFixed(2)})</span>
                        </div>
                        <div><strong>Estimated Cost:</strong> ${totalCost.toFixed(2)}</div>
                        {universes !== null && (
                            <div><strong>Universes Required:</strong> {universes}</div>
                        )}

                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2 pt-4">
                <a
                    href={`https://www.amazon.com/s?k=led+${ledType.toLowerCase()}+${volts.toLowerCase()}v`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline font-medium"
                >
                    Search on Amazon
                </a>
            </div>
        </div>
    );
};

export default LEDCalculator;
