
export type PieChartDataType = {
    text: string,
    color: number,
    value: number,
}

export type configPieChartMulticolor = {
    textConfig: {
        x: number,
        startY: number,
        gap?: number,
    },
    pieConfig: {
        centerX: number,
        centerY: number,
        radius: number,
    }
    container?: Phaser.GameObjects.Container,
    inTablet?: boolean,
}

export class PieChartMultiColor {
    items: any[] = [];
    constructor(scene: Phaser.Scene, data: PieChartDataType[], config: configPieChartMulticolor) {
        const gap = config.textConfig.gap || 10;

        // Dibujar leyenda
        data.forEach((dataItem, index) => {
            const a = scene.add.rectangle(
                config.textConfig.x,
                config.textConfig.startY + index * 40,
                20, 20,
                dataItem.color, 1
            ).setOrigin(1, 0.5).setStrokeStyle(1, 0x32F9C0);

            const b = scene.add.text(
                config.textConfig.x + gap,
                config.textConfig.startY + index * 40,
                dataItem.text, {}
            ).setOrigin(0, 0.5).setStyle({
                fontFamily: "MontserratBold",
                fontSize: "20px",
                color: "#32F9C0",
                align: "center",
            });

            if (config.container) config.container.add([a, b]);
            this.items.push(a, b);
        });

        const graphics = scene.add.graphics();
        const centerX = config.pieConfig.centerX;
        const centerY = config.pieConfig.centerY;
        const radius = config.pieConfig.radius;
        const segmentGap = 2;

        const total = data.reduce((sum, item) => sum + item.value, 0);
        const backgroundCircle = scene.add.circle(centerX, centerY, radius, 0x32F9C0, 1)

        let startAngle = 0;
        data.forEach(segment => {
            const percentage = (segment.value >= 0 ? segment.value : 0) / total;
            const endAngle = startAngle + percentage * Math.PI * 2;
            const midAngle = (startAngle + endAngle) / 2;

            const offsetX = Math.cos(midAngle) * segmentGap;
            const offsetY = Math.sin(midAngle) * segmentGap;

            graphics.fillStyle(segment.color, 1);
            graphics.slice(centerX + offsetX, centerY + offsetY, radius, startAngle, endAngle, false);
            graphics.fillPath();

            startAngle = endAngle;
        });

        const graphics2 = scene.add.graphics();
        graphics2.lineStyle(10, 0x232323); 
        graphics2.strokeCircle(centerX, centerY, radius*18/17 ); 
        graphics2.closePath();
        const graphics3 = scene.add.graphics();
        graphics3.lineStyle(3, 0x32F9C0);
        graphics3.strokeCircle(centerX, centerY, radius ); 
        graphics3.closePath();

        const innerCircle = scene.add.circle(centerX, centerY, radius / 2, 0x232323, 1).setStrokeStyle(3, 0x32F9C0)

        if (config.inTablet) scene.cameras.main.ignore(graphics);
        if (config.container) config.container.add([
            backgroundCircle,
            graphics,
            innerCircle,
            graphics2,
            graphics3,
        ]);
        this.items.push(backgroundCircle, graphics, innerCircle, graphics2, graphics3)
    }

    destroy() {
        this.items.forEach(item => item.destroy());
    }
}
