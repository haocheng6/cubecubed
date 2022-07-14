import { ANIME, EASE_TYPE } from "@consts";

import { PT_TO_COORDS_DATA } from "@cubicons/coordinate-system/Axes";

import { Animation } from "./Animation";
import { Create } from "./Create";

import { AxisProjector } from "@cubicons/coordinate-system/AxisProjector";
import { Point } from "@cubicons/coordinate-system/Point";

/**
 * The creation of a point and its two axis projectors.
 */
export class PointToCoords extends Animation {
    readonly animationType = "PointToCoords";

    private projectors: [AxisProjector, AxisProjector];

    constructor(params: {
        /**
         * The target point object for this animation.
         *
         * This is the result point after calling Axes().pointToCoords(args).
         */
        point: PT_TO_COORDS_DATA;
        /**
         * Time to play this animation. (in milliseconds)
         */
        duration?: number;
        /**
         * Custom easing function for smooth animation.
         */
        ease?: EASE_TYPE;
    }) {
        super({
            cubicon: params.point.point,
            duration: params.duration ?? ANIME.CREATE,
            ease: params.ease,
        });

        this.projectors = params.point.projectors;
    }

    play() {
        this.ptToCoords(this.cubicon, this.projectors);
    }

    private ptToCoords(
        point: Point,
        projectors: [AxisProjector, AxisProjector]
    ) {
        const anims = [
            new Create({ cubicon: point }),
            new Create({ cubicon: projectors[0] }),
            new Create({ cubicon: projectors[1] }),
        ];

        point.group.play(anims);

        point.group.groupElapsed -= Math.max(
            ...anims.map((anim) => anim.duration)
        );
    }
}
