
export const tweenButtonOver = (_target: any, scale: number = 1.2,activeScene: Phaser.Scene) => {
   activeScene.tweens.add({
        targets: _target,
        scaleX: scale,
        scaleY: scale,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: 'lineal',
    });
}

export const tweenButtonOut = (_target: any, scale: number = 1,activeScene: Phaser.Scene) => {
    activeScene.tweens.add({
        targets: _target,
        scaleX: scale,
        scaleY: scale,
        duration: 200,
        ease: 'Bounce.easeOut'
    });

}

export const tweenStarFalling = (_target: any, heightContainer: number, betweenScaleA: number = 0.3 , betweenScaleB: number = 1, callback: Function, activeScene: Phaser.Scene) => {

    activeScene.tweens.add({
        targets: _target,
        y: heightContainer + 30,
        alpha: 0,
        repeat: Phaser.Math.Between(-1, 1),
        delay: Phaser.Math.Between(0, 4000), 
        duration: Phaser.Math.Between(2000, 3500), 
        onComplete: () => {
            _target.alpha = 1;
            _target.y = -heightContainer; 
            _target.x = Phaser.Math.Between(50, 350); 
            _target.setScale(Phaser.Math.FloatBetween(betweenScaleA, betweenScaleB));
            activeScene.tweens.add({
                targets: _target,
                y: heightContainer,
                duration: Phaser.Math.Between(2000, 3500),
                //onComplete: () => callback(),
            });
        },
    });
}

export const tweenWorldTransition = (_target:any, nextTexture: string, nonBackground: Phaser.GameObjects.Rectangle, activeTweenFunction: Function, activeScene: Phaser.Scene) => {

    nonBackground.setVisible(true);
    activeScene.tweens.add({
        targets: _target,
        alpha: 0,
        duration: 200,
        onComplete: () => {
            _target.setTexture(nextTexture);
            activeScene.tweens.add({
                targets: _target,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    nonBackground.setVisible(false);
                    activeTweenFunction();
                }
            });
        },
    });

}
