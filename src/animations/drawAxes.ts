import * as d3 from "d3";
import { Axes } from "../cubicons/coordinateSys";
import { Animation } from "./animation";

export class DrawAxes extends Animation {
    private xNums;
    private yNums;
    private delayEach;

    private arrowDuration = 600;

    constructor(axes: Axes) {
        super({ cubicon: axes });

        this.xNums = -this.cubicon.xRange[0] + this.cubicon.xRange[1];
        this.yNums = -this.cubicon.yRange[0] + this.cubicon.yRange[1];

        this.delayEach = 100;

        this.duration =
            Math.max(
                (this.xNums + 2) * this.delayEach,
                (this.yNums + 2) * this.delayEach
            ) + this.arrowDuration;
    }

    play(sleepTime: number) {
        this.#drawAxis(this.cubicon.xAxis, sleepTime);
        this.#drawAxis(this.cubicon.yAxis, sleepTime);

        this.cubicon.elapsedTime += this.duration + sleepTime;
    }

    #drawAxis(axis: any, sleepTime: number) {
        /// Draw axis
        const path = axis.select("path.domain");
        const l = path.node().getTotalLength();

        path.attr("stroke-dasharray", l + ", " + l).attr(
            "stroke-dashoffset",
            l
        );
        path.transition()
            .ease(this.ease)
            .delay(this.cubicon.elapsedTime + sleepTime)
            .duration(this.duration)
            .attr("stroke-dashoffset", 0);

        /// Mark ticks
        axis.selectAll("g.tick")
            .attr("opacity", 0)
            .data(d3.range(0, this.xNums + 1, 1))
            .transition()
            .ease(this.ease)
            .delay(
                (d: number) =>
                    this.cubicon.elapsedTime + sleepTime + this.delayEach * d
            )
            .duration(this.duration)
            .attr("opacity", 1);

        /// Fade in axes' arrows
        axis.select("defs marker path")
            .attr("opacity", 0)
            .data(d3.range(0, this.yNums + 1, 1))
            .transition()
            .ease(this.ease)
            .delay(
                this.cubicon.elapsedTime +
                    sleepTime +
                    this.delayEach * this.xNums
            )
            .duration(this.arrowDuration)
            .attr("opacity", 1);
    }
}
