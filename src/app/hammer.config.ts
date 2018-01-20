import { HammerGestureConfig } from '@angular/platform-browser';
import { HammerInstance } from "@angular/platform-browser/src/dom/events/hammer_gestures";

export class HammerConfig extends HammerGestureConfig {
    buildHammer(element: HTMLElement): HammerInstance {
        var mc = new Hammer(element);
        mc.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }));
        for (let eventName in this.overrides)
            mc.get(eventName).set(this.overrides[eventName]);
        return mc;
    }
}