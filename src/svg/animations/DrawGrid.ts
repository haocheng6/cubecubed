import katex from "katex";
//+++++++++++++++++++++++++++++++++++++++++++++++++++//

import { Animation } from "./Animation";
import { Create } from "./Create";

import { Grid } from "@cubicons/geometry/Grid";
import { GridOrigin } from "@cubicons/geometry/Circle";

export class DrawGridFromScreenSides extends Animation {
    readonly animationType = "DrawGrid";

    private drawX = 1000;
    private drawXNums = 500;
    private drawXNumsDelay = 800;

    private drawY = 1000;
    private drawYDelay = 200;
    private drawYNums = 500;
    private drawYNumsDelay = 800;

    private xDelayEach = 50;
    private yDelayEach = 20;

    private hasNums: boolean;

    constructor(grid: Grid) {
        super({ cubicon: grid });

        const { xBound, yBound } = grid.group;

        this.duration = Math.max(
            Math.max(
                this.drawX + this.xDelayEach * xBound[1],
                this.drawXNums + this.drawXNumsDelay
            ),
            Math.max(
                this.drawY + this.drawYDelay + this.yDelayEach * yBound[1],
                this.drawYNums + this.drawYNumsDelay
            )
        );

        this.hasNums = grid.hasNums;
    }

    play(sleepTime: number) {
        this.drawHorizontalLines(this.cubicon, this.hasNums, sleepTime);
        this.drawVerticalLines(this.cubicon, this.hasNums, sleepTime);
        this.drawOrigin(this.cubicon);
    }

    private drawHorizontalLines(
        grid: Grid,
        hasNums: boolean,
        sleepTime: number
    ) {
        const { xBound, xGtoW, yGtoW } = grid.group;

        const horizontalLines = grid.g_horizontal
            .append("g")
            .attr("id", "horizontal-lines");
        horizontalLines
            .selectAll(".line-horizontal")
            .data(grid.yNumberRange)
            .enter()
            .append("line")
            .attr("x1", xGtoW(xBound[0]))
            .attr("y1", (d: number) => yGtoW(d))
            .attr("x2", xGtoW(xBound[0]))
            .attr("y2", (d: number) => yGtoW(d))
            .transition()
            .ease(this.ease)
            .delay((d: number) => sleepTime + this.xDelayEach * Math.abs(d))
            .duration(this.drawX)
            .attr("x2", xGtoW(xBound[1]))
            .attr("stroke", (d: number) =>
                xGtoW(d) === 0 ? grid.xAxesColor : grid.lineColor
            )
            .attr("stroke-width", (d: number) => (xGtoW(d) === 0 ? 2 : 1))
            .style("stroke-opacity", (d: number) => (d % 2 === 0 ? 1 : 0.2));

        if (hasNums) this.placeXAxisNums(grid, sleepTime);
    }

    private placeXAxisNums(grid: Grid, sleepTime: number) {
        const { xGtoW } = grid.group;

        const xNumWidth = 50;
        const xNumHeight = 20;

        const offsetX = xNumWidth / 2;

        const xAxisNumbers = grid.g_horizontal
            .append("g")
            .attr("id", "x-axis-numbers");
        xAxisNumbers
            .selectAll("foreignObject.x-axis-number")
            .data(grid.xNumberRange.slice(1, grid.xNumberRange.length - 1))
            .enter()
            .each((d: number) => {
                xAxisNumbers
                    .append("foreignObject")
                    .attr("class", "x-axis-number")
                    .attr("x", `${xGtoW(1) * d - offsetX}`)
                    .attr("y", 0)
                    .attr("width", xNumWidth)
                    .attr("height", xNumHeight)
                    .attr("transform", "scale(1,-1)")
                    .attr("opacity", 0)
                    .style("text-align", "center")
                    .append("xhtml:text")
                    .style("color", "#fff")
                    .node().innerHTML =
                    d !== 0 ? katex.renderToString(`${d}`) : "";
            });
        xAxisNumbers
            .selectAll("foreignObject.x-axis-number")
            .transition()
            .ease(this.ease)
            .duration(this.drawXNums)
            .delay(this.drawXNumsDelay + sleepTime)
            .attr("opacity", 1);
    }

    private drawVerticalLines(grid: Grid, hasNums: boolean, sleepTime: number) {
        const { yBound, xGtoW, yGtoW } = grid.group;

        const verticalLines = grid.g_vertical
            .append("g")
            .attr("id", "vertical-lines");
        verticalLines
            .selectAll(".line-vertical")
            .data(grid.xNumberRange)
            .enter()
            .append("line")
            .attr("x1", (d: number) => xGtoW(d))
            .attr("y1", yGtoW(yBound[0]))
            .attr("x2", (d: number) => xGtoW(d))
            .attr("y2", yGtoW(yBound[0]))
            .transition()
            .ease(this.ease)
            .delay(
                (d: number) =>
                    this.drawYDelay + sleepTime + this.yDelayEach * Math.abs(d)
            )
            .duration(this.drawY)
            .attr("y2", yGtoW(yBound[1]))
            .attr("stroke", (d: number) =>
                yGtoW(d) === 0 ? grid.yAxesColor : grid.lineColor
            )
            .attr("stroke-width", (d: number) => (yGtoW(d) === 0 ? 2 : 1))
            .style("stroke-opacity", (d: number) => (d % 2 === 0 ? 1 : 0.2));

        if (hasNums) this.placeYAxisNums(grid, sleepTime);
    }

    private placeYAxisNums(grid: Grid, sleepTime: number) {
        const { yGtoW } = grid.group;

        const yNumWidth = 50;
        const yNumHeight = 20;

        const offsetY = yNumHeight / 2;

        const yAxisNumbers = grid.g_vertical
            .append("g")
            .attr("id", "y-axis-numbers");
        yAxisNumbers
            .selectAll("foreignObject.y-axis-number")
            .data(grid.yNumberRange.slice(1, grid.yNumberRange.length - 1))
            .enter()
            .each((d: number) => {
                yAxisNumbers
                    .append("foreignObject")
                    .attr("class", "y-axis-number")
                    .attr("x", 0)
                    .attr("y", `${yGtoW(-1) * d - offsetY}`)
                    .attr("width", yNumWidth)
                    .attr("height", yNumHeight)
                    .attr("transform", "scale(1,-1)")
                    .attr("opacity", 0)
                    .style("text-align", "center")
                    .append("xhtml:text")
                    .style("color", "#fff")
                    .node().innerHTML =
                    d !== 0 ? katex.renderToString(`${d}`) : "";
            });
        yAxisNumbers
            .selectAll("foreignObject.y-axis-number")
            .transition()
            .ease(this.ease)
            .duration(this.drawYNums)
            .delay(this.drawYNumsDelay + sleepTime)
            .attr("opacity", 1);
    }

    drawOrigin(grid: Grid) {
        const drawOriginAnim = new Create({
            cubicon: new GridOrigin(grid.group).render(),
        });

        grid.group.play([drawOriginAnim]);

        grid.group.groupElapsed -= drawOriginAnim.duration;
    }
}
