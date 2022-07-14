import { EASE_TYPE, EASE } from "@consts";

import { Cubicon } from "@cubicons/Cubicon";

import { Rectangle } from "@cubicons/geometry/Rectangle";
import { Square } from "@cubicons/geometry/Square";
import { Circle } from "@cubicons/geometry/Circle";
import { Line } from "@cubicons/geometry/Line";
import { VectorShape } from "@cubicons/geometry/VectorShape";

import { Graph } from "@cubicons/coordinate-system/Graph";
import { Point } from "@cubicons/coordinate-system/Point";
import { AxisProjector } from "@cubicons/coordinate-system/AxisProjector";

/**
 * Legal shape types to play Create() animation.
 */
export type CREATE_SHAPE_TYPES = Rectangle | Square | Circle | Graph | Point;

/**
 * Legal line-like types to play Create() animation.
 */
export type CREATE_LINE_TYPES = Line | VectorShape | AxisProjector;

/**
 * Legal cubicon types to play Create() animation.
 */
export type CREATE_TYPES = CREATE_SHAPE_TYPES | CREATE_LINE_TYPES;

export abstract class Animation {
    abstract readonly animationType: string;

    /**
     * The target cubicon of this animation.
     */
    cubicon: any;

    /**
     * Time to play this animation (in milliseconds).
     */
    duration: number;

    /**
     * The easing function to use.
     */
    ease: EASE_TYPE;

    constructor({
        cubicon,
        duration,
        ease,
    }: {
        cubicon: Cubicon;
        duration?: number;
        ease?: EASE_TYPE;
    }) {
        this.cubicon = cubicon;
        this.duration = duration ?? 0;
        this.ease = ease ?? EASE.CUBIC;
    }
}
